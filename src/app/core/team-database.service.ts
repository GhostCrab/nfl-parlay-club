import { Injectable } from '@angular/core';

import {
  IParlayTeam,
  ParlayTeam,
} from '../features/teams/interfaces/parlay-team.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamDatabaseService {
  private teams: IParlayTeam[] = [
    new ParlayTeam(0, 'ARIZONA', 'CARDINALS', 'ARI', true),
    new ParlayTeam(1, 'ATLANTA', 'FALCONS', 'ATL', true),
    new ParlayTeam(2, 'BALTIMORE', 'RAVENS', 'BAL', true),
    new ParlayTeam(3, 'BUFFALO', 'BILLS', 'BUF', true),
    new ParlayTeam(4, 'CAROLINA', 'PANTHERS', 'CAR', true),
    new ParlayTeam(5, 'CHICAGO', 'BEARS', 'CHI', true),
    new ParlayTeam(6, 'CINCINNATI', 'BENGALS', 'CIN', true),
    new ParlayTeam(7, 'CLEVELAND', 'BROWNS', 'CLE', true),
    new ParlayTeam(8, 'DALLAS', 'COWBOYS', 'DAL', true),
    new ParlayTeam(9, 'DENVER', 'BRONCOS', 'DEN', true),
    new ParlayTeam(10, 'DETROIT', 'LIONS', 'DET', true),
    new ParlayTeam(11, 'GREEN BAY', 'PACKERS', 'GB', true),
    new ParlayTeam(12, 'HOUSTON', 'TEXANS', 'HOU', true),
    new ParlayTeam(13, 'INDIANAPOLIS', 'COLTS', 'IND', true),
    new ParlayTeam(14, 'JACKSONVILLE', 'JAGUARS', 'JAC', true),
    new ParlayTeam(15, 'KANSAS CITY', 'CHIEFS', 'KC', true),
    new ParlayTeam(16, 'LOS ANGELES', 'CHARGERS', 'LAC', true),
    new ParlayTeam(17, 'LOS ANGLES', 'RAMS', 'LAR', true),
    new ParlayTeam(18, 'MIAMI', 'DOLPHINS', 'MIA', true),
    new ParlayTeam(19, 'MINNESOTA', 'VIKINGS', 'MIN', true),
    new ParlayTeam(20, 'NEW ENGLAND', 'PATRIOTS', 'NE', true),
    new ParlayTeam(21, 'NEW ORLEANS', 'SAINTS', 'NO', true),
    new ParlayTeam(22, 'NEW YORK', 'GIANTS', 'NYG', true),
    new ParlayTeam(23, 'NEW YORK', 'JETS', 'NYJ', true),
    new ParlayTeam(24, 'LAS VEGAS', 'RAIDERS', 'LV', true),
    new ParlayTeam(25, 'PHILADELPHIA', 'EAGLES', 'PHI', true),
    new ParlayTeam(26, 'PITTSBURGH', 'STEELERS', 'PIT', true),
    new ParlayTeam(27, 'SAN FRANCISCO', '49ERS', 'SF', true),
    new ParlayTeam(28, 'SEATTLE', 'SEAHAWKS', 'SEA', true),
    new ParlayTeam(29, 'TAMPA BAY', 'BUCCANEERS', 'TB', true),
    new ParlayTeam(30, 'TENNESSEE', 'TITANS', 'TEN', true),
    new ParlayTeam(31, 'WASHINGTON', 'COMMANDERS', 'WAS', true),
    new ParlayTeam(32, 'UNDER', 'UNDER', 'UND', false),
    new ParlayTeam(33, 'OVER', 'OVER', 'OVR', false),
    new ParlayTeam(34, 'PUSH', 'PUSH', 'PSH', false),
  ];

  constructor() {}

  fromName(name: string) {
    const capName = name.toUpperCase();
    for (const team of this.teams) {
      if (team.name === capName) return team;
    }

    throw new Error('Unable to find team with name ' + name);
  }

  fromID(id: number) {
    if (id < this.teams.length && id >= 0)
      return this.teams[id];
    
    throw new Error('Unable to find team with id ' + id.toString());
  }

  fromAmbig(input: IParlayTeam | number | string) {
    switch (typeof input) {
      case "number": return this.fromID(input);
      case "string": return this.fromName(input);
    }

    return input;
  }

  allActiveTeams() {
    return this.teams.filter((a) => a.isActive());
  }

  allTeams(includeOthers = false, abbrOnly = false) {
    const teams = [];

    for (const team of this.teams) {
      if (includeOthers || !(team.isOU() || team.isPush())) {
        if (abbrOnly) {
          teams.push(team.abbr);
        } else {
          teams.push(team);
        }
      }
    }
  }
}
