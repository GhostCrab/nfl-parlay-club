import { Query } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';
import { IParlayGameRow } from 'src/app/core/interfaces/parlay-game-row.interface';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import {
  NFLData,
  NFLResults,
} from '../../../core/interfaces/nfl-api.interface';
import { IParlayTeam } from '../../teams/interfaces/parlay-team.interface';

const week1Start = new Date('2022-09-07T07:00:00Z');

export interface IParlayGame {
  gameID: string;
  home: IParlayTeam;
  away: IParlayTeam;
  gt: Date;
  week: number;
  season: number;
  fav: IParlayTeam;
  spread: number;
  ou: number;
  complete: boolean;
  homeScore: number;
  awayScore: number;

  updateFromAPI(result: NFLResults): void;
  updateOddsFromAPI(result: NFLResults): void;
  updateScoreAndDate(game: IParlayGame): boolean;
  updateOdds(game: IParlayGame): boolean;
  updateAll(game: IParlayGame): boolean;
  toParlayGameRow(): IParlayGameRow;
  writeToDb(gamedb: GameDatabaseService): Promise<void>;
  addToDb(gamedb: GameDatabaseService): Promise<void>;
  isThursdayGame(): boolean;
  safeTime(): Date;
  toString(): string;
  status(): string;
  shortStatus(): string;
  weekday(): string;
  time(): string;
  getWinner(): IParlayTeam;
  getOUWinner(): IParlayTeam;
}

function generateGameUID(game: IParlayGame) {
  function pad(num: number) {
    let numstr = num.toString();
    while (numstr.length < 2) numstr = '0' + numstr;
    return numstr;
  }

  return `${pad(game.week)}${pad(game.home.teamID)}`;
}

export class ParlayGame implements IParlayGame {
  public gameID: string;
  public home: IParlayTeam;
  public away: IParlayTeam;
  public gt: Date;
  public week: number;
  public season: number;
  public fav: IParlayTeam;
  public spread: number;
  public ou: number;
  public complete: boolean;
  public homeScore: number;
  public awayScore: number;
  private dirty: boolean;

  private winner: IParlayTeam | undefined;
  private ouWinner: IParlayTeam | undefined;

  private teamdb: TeamDatabaseService;

  public constructor(
    home: string,
    away: string,
    date: number,
    teamdb: TeamDatabaseService
  );

  public constructor(dbdata: IParlayGameRow, teamdb: TeamDatabaseService);

  constructor(...args: any[]) {
    this.dirty = false;
    // database constructor
    if (args.length === 2) {
      const [dbdata, teamdb] = args as [IParlayGameRow, TeamDatabaseService];

      this.teamdb = teamdb;

      this.gameID = dbdata.gameID;
      this.home = teamdb.fromID(dbdata.homeTeamID);
      this.away = teamdb.fromID(dbdata.awayTeamID);
      this.gt = dbdata.gt.toDate();
      this.week = dbdata.week;
      this.season = dbdata.season;
      this.fav = teamdb.fromID(dbdata.favTeamID);
      this.spread = dbdata.spread;
      this.ou = dbdata.ou;
      this.complete = dbdata.complete;
      this.homeScore = dbdata.homeScore;
      this.awayScore = dbdata.awayScore;

      this.updateWinner();
    }

    // team/date consructor
    if (args.length === 4) {
      const [home, away, date, teamdb] = args as [
        string,
        string,
        number,
        TeamDatabaseService
      ];

      this.teamdb = teamdb;

      this.home = teamdb.fromName(home);
      this.away = teamdb.fromName(away);

      if (date <= 18) {
        this.week = date;
        this.gt = getDateFromWeek(this.week);
        // assume sunday 10 AM Pacific
      } else {
        this.gt = new Date(date);
        this.week = getWeekFromDate(this.gt);
      }

      this.season = 2022;
      this.gameID = generateGameUID(this);

      // uninitalized members
      this.fav = this.home;
      this.spread = 0;
      this.ou = 0;
      this.complete = false;
      this.homeScore = 0;
      this.awayScore = 0;
    }
  }

  updateScoreAndDate(game: IParlayGame): boolean {
    let updated = false;
    if (this.gt.getTime() !== game.gt.getTime()) {
      console.log(
        `${this.toString()} this.gt.getTime() !== game.gt.getTime(): ${this.gt.getTime()} !== ${game.gt.getTime()}`
      );
      this.gt = game.gt;
      updated = true;
    }

    if (this.week !== game.week) {
      console.log(
        `${this.toString()} this.week !== game.week: ${this.week} !== ${
          game.week
        }`
      );
      this.week = game.week;
      updated = true;
    }

    if (this.complete !== game.complete) {
      console.log(
        `${this.toString()} this.complete !== game.complete: ${
          this.complete
        } !== ${game.complete}`
      );
      this.complete = game.complete;
      updated = true;
    }

    if (this.homeScore !== game.homeScore) {
      console.log(
        `${this.toString()} this.homeScore !== game.homeScore: ${
          this.homeScore
        } !== ${game.homeScore}`
      );
      this.homeScore = game.homeScore;
      updated = true;
    }

    if (this.awayScore !== game.awayScore) {
      console.log(
        `${this.toString()} this.awayScore !== game.awayScore: ${
          this.awayScore
        } !== ${game.awayScore}`
      );
      this.awayScore = game.awayScore;
      updated = true;
    }

    if (updated) {
      this.updateWinner();
      this.dirty = true;
    }

    return updated;
  }

  updateOdds(game: IParlayGame, force = false): boolean {
    // sanity check to not update odds after wednesday at midnight the current week
    const ms10Hours = 10 * 60 * 60 * 1000;
    const ms3Days = 3 * 24 * 60 * 60 * 1000;
    const sundayDate = getDateFromWeek(this.week);
    let cutoffDate = new Date(sundayDate.getTime() - ms10Hours - ms3Days);
    const now = new Date();
    if (now > cutoffDate && !force)
      throw new Error(
        `Attempted to update odds after cutoff date ${now.toLocaleString()} > ${cutoffDate.toLocaleString()}`
      );

    // sunday date is 10AM, minus 10 hours, minus

    let updated = false;
    if (this.fav.teamID !== game.fav.teamID) {
      console.log(
        `${this.toString()} this.fav.teamID !== game.fav.teamID: ${
          this.fav.teamID
        } !== ${game.fav.teamID}`
      );
      this.fav = game.fav;
      updated = true;
    }

    if (this.spread !== game.spread) {
      console.log(
        `${this.toString()} this.spread !== game.spread: ${this.spread} !== ${
          game.spread
        }`
      );
      this.spread = game.spread;
      updated = true;
    }

    if (this.ou !== game.ou) {
      console.log(
        `${this.toString()} this.ou !== game.ou: ${this.ou} !== ${game.ou}`
      );
      this.ou = game.ou;
      updated = true;
    }

    if (updated) {
      this.updateWinner();
      this.dirty = true;
    }

    // this.ou = 0;
    // this.dirty = true;

    return updated;
  }

  updateAll(game: IParlayGame): boolean {
    const u1 = this.updateScoreAndDate(game);
    let u2 = false;
    try {
      u2 = this.updateOdds(game);
    } catch (e) {
      console.log(`Warning: ${e}`)
    }

    return u1 || u2;
  }

  updateFromAPI(result: NFLResults): void {
    this.gt = new Date(result.date);
    this.week = getWeekFromDate(this.gt);
    this.complete = result.timeLeft?.includes('Final') || false;
    if (this.complete) {
      this.homeScore = result.team2Score;
      this.awayScore = result.team1Score;

      this.updateWinner();
    }
  }

  updateOddsFromAPI(result: NFLResults): void {
    for (const odds of result.odds) {
      if (odds.provider === 'CONSENSUS') {
        // round spread to nearest half point
        const spread = Math.round(odds.spread * 2) / 2; //(Math.round((odds.spread * 10) / 5) * 5) / 5

        // positive spread favors away team
        if (spread > 0) {
          this.fav = this.away;
          this.spread = -spread;
        } else {
          this.fav = this.home;
          this.spread = spread;
        }

        // round ou to nearest half point
        this.ou = Math.round(odds.overUnder * 2) / 2; //(Math.round((odds.overUnder * 10) / 5) * 5) / 5

        this.updateWinner();
        break;
      }
    }
  }

  toParlayGameRow(): IParlayGameRow {
    return {
      gameID: this.gameID,
      homeTeamID: this.home.teamID,
      awayTeamID: this.away.teamID,
      gt: Timestamp.fromDate(this.gt),
      week: this.week,
      season: this.season,
      favTeamID: this.fav.teamID,
      spread: this.spread,
      ou: this.ou,
      complete: this.complete,
      homeScore: this.homeScore,
      awayScore: this.awayScore,
    };
  }

  async writeToDb(gamedb: GameDatabaseService): Promise<void> {
    if (this.dirty) {
      console.log(`Updating ${this.toString()} in db`);
      await gamedb.updateGame(this);
      this.dirty = false;
    }
  }

  async addToDb(gamedb: GameDatabaseService): Promise<void> {
    console.log(`Adding ${this.toString()} to db`);
    await gamedb.addGame(this);
  }

  toString() {
    return `W${this.week} ${this.away.abbr} @ ${this.home.abbr} [${this.spread} / ${this.ou}]`;
  }

  static sort(a: IParlayGame, b: IParlayGame): number {
    if (a.gt.getTime() - b.gt.getTime() !== 0) {
      return a.gt.getTime() - b.gt.getTime();
    }
    return a.away.name.localeCompare(b.away.name);
  }

  safeTime(): Date {
    // safe time is either 10AM Pacific on the Sunday of the week the game is played, or the current game time, whichever is earlier
    const sundayDate = getDateFromWeek(this.week);
    if (sundayDate <= this.gt) return sundayDate;

    return this.gt;
  }

  isThursdayGame(): boolean {
    const sundayDate = getDateFromWeek(this.week);
    const ms2Days = 2 * 24 * 60 * 60 * 1000;
    const fridayDate = new Date(sundayDate.getTime() - ms2Days);

    if (this.gt > fridayDate) return false;

    return true;
  }

  status(): string {
    if (!this.complete) {
      return (
        this.gt.toLocaleString('en-US', {
          weekday: 'short',
        }) +
        ' ' +
        this.gt.toLocaleString('en-US', {
          dateStyle: 'short',
          timeStyle: 'short',
        })
      );
    }

    return '';
  }

  shortStatus(): string {
    if (!this.complete) {
      return (
        this.gt.toLocaleString('en-US', {
          weekday: 'short',
        }) +
        ' ' +
        this.gt.toLocaleString('en-US', {
          timeStyle: 'short',
        })
      );
    }

    return '';
  }

  weekday(): string {
    return this.gt.toLocaleString('en-US', {
      weekday: 'short',
    });
  }

  time(): string {
    return this.gt.toLocaleString('en-US', {
      timeStyle: 'short',
    })
  }

  updateWinner(): void {
    if (this.complete) {
      if (this.fav.teamID === this.home.teamID) {
        if (this.homeScore + this.spread === this.awayScore) {
          this.winner = this.teamdb.fromName('PUSH');
        } else if (this.homeScore + this.spread > this.awayScore) {
          this.winner = this.home;
        } else {
          this.winner = this.away;
        }
      } else {
        if (this.awayScore + this.spread === this.homeScore) {
          this.winner = this.teamdb.fromName('PUSH');
        } else if (this.awayScore + this.spread > this.homeScore) {
          this.winner = this.away;
        } else {
          this.winner = this.home;
        }
      }

      if (this.homeScore + this.awayScore === this.ou) {
        this.ouWinner = this.teamdb.fromName('PUSH');
      } else if (this.homeScore + this.awayScore > this.ou) {
        this.ouWinner = this.teamdb.fromName('OVER');
      } else {
        this.ouWinner = this.teamdb.fromName('UNDER');
      }
    } else {
      this.winner = undefined;
      this.ouWinner = undefined;
    }
  }

  getWinner(): IParlayTeam {
    if (!this.winner)
      throw Error('Attempted to get winner from incomplete game');
    return this.winner;
  }

  getOUWinner(): IParlayTeam {
    if (!this.ouWinner)
      throw Error('Attempted to get OU winner from incomplete game');
    return this.ouWinner;
  }
}

export function getWeekFromDate(gt: Date): number {
  return (
    Math.floor(
      (gt.getTime() - week1Start.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1
  );
}

// Sunday 10 AM pacific for current week
export function getDateFromWeek(week: number) {
  const ms11Hours = 11 * 60 * 60 * 1000;
  const ms10Hours = 10 * 60 * 60 * 1000;
  const ms4Days = 4 * 24 * 60 * 60 * 1000;
  const ms7Days = 7 * 24 * 60 * 60 * 1000;
  if (week <= 8) {
    return new Date(
      week1Start.getTime() + ms10Hours + ms4Days + (week - 1) * ms7Days
    );
  }

  return new Date(
    week1Start.getTime() + ms11Hours + ms4Days + (week - 1) * ms7Days
  );
}

export function getWeekFromAmbig(data: number | Date) {
  switch (typeof data) {
    case 'number': {
      if (data <= 18) return data;
      return getWeekFromDate(new Date(data));
    }
  }

  return getWeekFromDate(data);
}
