import { Query } from '@angular/core';
import { GameDatabaseService } from 'src/app/core/game-database.service';
import { IParlayGameRow } from 'src/app/core/interfaces/parlay-game-row.interface';
import { TeamDatabaseService } from 'src/app/core/team-database.service';
import { NFLData, NFLResults } from '../../nfl/interfaces/nfl.interface';
import { IParlayTeam } from '../../teams/interfaces/parlay-team.interface';

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

  updateFromDatabase(gamedb: GameDatabaseService): void;
  updateFromAPI(result: NFLResults): void;
  updateScoreAndDate(game: IParlayGame): void;
  toParlayGameRow(): IParlayGameRow;
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

  public constructor(
    home: string,
    away: string,
    date: number,
    teamdb: TeamDatabaseService
  );

  public constructor(dbdata: IParlayGameRow, teamdb: TeamDatabaseService);

  constructor(...args: any[]) {
    // database constructor
    if (args.length === 2) {
      const [dbdata, teamdb] = args as [IParlayGameRow, TeamDatabaseService];

      this.gameID = dbdata.gameID;
      this.home = teamdb.fromID(dbdata.homeTeamID);
      this.away = teamdb.fromID(dbdata.homeTeamID);
      this.gt = dbdata.gt;
      this.week = dbdata.week;
      this.season = dbdata.season;
      this.fav = teamdb.fromID(dbdata.favTeamID);
      this.spread = dbdata.spread;
      this.ou = dbdata.ou;
      this.complete = dbdata.complete;
      this.homeScore = dbdata.homeScore;
      this.awayScore = dbdata.awayScore;
    }

    // team/date consructor
    if (args.length === 4) {
      const [home, away, date, teamdb] = args as [
        string,
        string,
        number,
        TeamDatabaseService
      ];
      this.home = teamdb.fromName(home);
      this.away = teamdb.fromName(away);

      if (date <= 18) {
        this.week = date;
        this.gt = getDateFromWeek(this.week);
        // assume sunday/noon
      } else {
        this.gt = new Date(date);
        this.week = getWeekFromDate(this.gt);
      }

      this.season = 2022;

      // uninitalized members
      this.gameID = '';
      this.fav = this.home;
      this.spread = 0;
      this.ou = 0;
      this.complete = false;
      this.homeScore = 0;
      this.awayScore = 0;
    }
  }

  updateScoreAndDate(game: IParlayGame): void {
    this.gt = game.gt;
    this.week = game.week;
    this.complete = game.complete;
    this.homeScore = game.homeScore;
    this.awayScore = game.awayScore;
  }

  updateFromAPI(result: NFLResults): void {
    this.gt = new Date(result.date);
    this.week = getWeekFromDate(this.gt);
    this.complete = result.timeLeft?.includes('Final') || false;
    if (this.complete) {
      this.homeScore = result.team2Score;
      this.awayScore = result.team1Score;
    }
  }

  updateFromDatabase(gamedb: GameDatabaseService): void {
    gamedb.fromParlayGame(this).subscribe({
      next: (data) => console.log(data),
      complete: () => console.log('COMPLETE'),
    });
  }

  toParlayGameRow(): IParlayGameRow {
    return {
      gameID: this.gameID,
      homeTeamID: this.home.teamID,
      awayTeamID: this.away.teamID,
      gt: this.gt,
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
}

export function getWeekFromDate(gt: Date): number {
  const week1Start = new Date('2022-09-07T07:00:00Z');
  // console.log(week1Start);
  return (
    Math.floor(
      (gt.getTime() - week1Start.getTime()) / (7 * 24 * 60 * 60 * 1000)
    ) + 1
  );
}

export function getDateFromWeek(week: number) {
  const week1Start = new Date('2022-09-07T07:00:00Z');
  const ms12Hours = 12 * 60 * 60 * 1000;
  const ms4Days = 4 * 24 * 60 * 60 * 1000;
  const ms7Days = 7 * 24 * 60 * 60 * 1000;
  return new Date(
    week1Start.getTime() + ms12Hours + ms4Days + (week - 1) * ms7Days
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
