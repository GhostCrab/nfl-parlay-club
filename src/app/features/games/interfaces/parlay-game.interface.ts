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
  updateScoreAndDate(game: IParlayGame): void;
  updateOdds(game: IParlayGame): void;
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

  updateOdds(game: IParlayGame): void {
    this.fav = game.fav;
    this.spread = game.spread;
    this.ou = game.ou;
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
