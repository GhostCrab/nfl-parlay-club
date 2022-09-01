import { Injectable } from '@angular/core';

import {
  IParlayTeam,
  ParlayTeam,
} from '../../features/teams/interfaces/parlay-team.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamDatabaseService {
  private teams: IParlayTeam[] = [
    new ParlayTeam(0, 'ARIZONA', 'CARDINALS', 'ARI', "https://ssl.gstatic.com/onebox/media/sports/logos/5Mh3xcc8uAsxAi3WZvfEyQ_48x48.png", true),
    new ParlayTeam(1, 'ATLANTA', 'FALCONS', 'ATL', "https://ssl.gstatic.com/onebox/media/sports/logos/QNdwQPxtIRYUhnMBYq-bSA_48x48.png", true),
    new ParlayTeam(2, 'BALTIMORE', 'RAVENS', 'BAL', "https://ssl.gstatic.com/onebox/media/sports/logos/1vlEqqoyb9uTqBYiBeNH-w_48x48.png", true),
    new ParlayTeam(3, 'BUFFALO', 'BILLS', 'BUF', "https://ssl.gstatic.com/onebox/media/sports/logos/_RMCkIDTISqCPcSoEvRDhg_48x48.png", true),
    new ParlayTeam(4, 'CAROLINA', 'PANTHERS', 'CAR', "https://ssl.gstatic.com/onebox/media/sports/logos/HsLg5tW_S7566EbsMPlcVQ_48x48.png", true),
    new ParlayTeam(5, 'CHICAGO', 'BEARS', 'CHI', "https://ssl.gstatic.com/onebox/media/sports/logos/7uaGv3B13mXyBhHcTysHcA_48x48.png", true),
    new ParlayTeam(6, 'CINCINNATI', 'BENGALS', 'CIN', "https://ssl.gstatic.com/onebox/media/sports/logos/wDDRqMa40nidAOA5883Vmw_48x48.png", true),
    new ParlayTeam(7, 'CLEVELAND', 'BROWNS', 'CLE', "https://ssl.gstatic.com/onebox/media/sports/logos/bTzlW33n9s53DxRzmlZXyg_48x48.png", true),
    new ParlayTeam(8, 'DALLAS', 'COWBOYS', 'DAL', "https://ssl.gstatic.com/onebox/media/sports/logos/-zeHm0cuBjZXc2HRxRAI0g_48x48.png", true),
    new ParlayTeam(9, 'DENVER', 'BRONCOS', 'DEN', "https://ssl.gstatic.com/onebox/media/sports/logos/ZktET_o_WU6Mm1sJzJLZhQ_48x48.png", true),
    new ParlayTeam(10, 'DETROIT', 'LIONS', 'DET', "https://ssl.gstatic.com/onebox/media/sports/logos/WE1l856fyyHh6eAbbb8hQQ_48x48.png", true),
    new ParlayTeam(11, 'GREEN BAY', 'PACKERS', 'GB', "https://ssl.gstatic.com/onebox/media/sports/logos/IlA4VGrUHzSVLCOcHsRKgg_48x48.png", true),
    new ParlayTeam(12, 'HOUSTON', 'TEXANS', 'HOU', "https://ssl.gstatic.com/onebox/media/sports/logos/sSUn9HRpYLQtEFF2aG9T8Q_48x48.png", true),
    new ParlayTeam(13, 'INDIANAPOLIS', 'COLTS', 'IND', "https://ssl.gstatic.com/onebox/media/sports/logos/zOE7BhKadEjaSrrFjcnR4w_48x48.png", true),
    new ParlayTeam(14, 'JACKSONVILLE', 'JAGUARS', 'JAC', "https://ssl.gstatic.com/onebox/media/sports/logos/HLfqVCxzVx5CUDQ07GLeWg_48x48.png", true),
    new ParlayTeam(15, 'KANSAS CITY', 'CHIEFS', 'KC', "https://ssl.gstatic.com/onebox/media/sports/logos/5N0l1KbG1BHPyP8_S7SOXg_48x48.png", true),
    new ParlayTeam(16, 'LOS ANGELES', 'CHARGERS', 'LAC', "https://ssl.gstatic.com/onebox/media/sports/logos/EAQRZu91bwn1l8brW9HWBQ_48x48.png", true),
    new ParlayTeam(17, 'LOS ANGLES', 'RAMS', 'LAR', "https://ssl.gstatic.com/onebox/media/sports/logos/CXW68CjwPIaUurbvSUSyJw_48x48.png", true),
    new ParlayTeam(18, 'MIAMI', 'DOLPHINS', 'MIA', "https://ssl.gstatic.com/onebox/media/sports/logos/1ysKnl7VwOQO8g94gbjKdQ_48x48.png", true),
    new ParlayTeam(19, 'MINNESOTA', 'VIKINGS', 'MIN', "https://ssl.gstatic.com/onebox/media/sports/logos/Vmg4u0BSYZ-1Mc-5uyvxHg_48x48.png", true),
    new ParlayTeam(20, 'NEW ENGLAND', 'PATRIOTS', 'NE', "https://ssl.gstatic.com/onebox/media/sports/logos/z89hPEH9DZbpIYmF72gSaw_48x48.png", true),
    new ParlayTeam(21, 'NEW ORLEANS', 'SAINTS', 'NO', "https://ssl.gstatic.com/onebox/media/sports/logos/AC5-UEeN3V_fjkdFXtHWfQ_48x48.png", true),
    new ParlayTeam(22, 'NEW YORK', 'GIANTS', 'NYG', "https://ssl.gstatic.com/onebox/media/sports/logos/q8qdTYh-OWR5uO_QZxFENw_48x48.png", true),
    new ParlayTeam(23, 'NEW YORK', 'JETS', 'NYJ', "https://ssl.gstatic.com/onebox/media/sports/logos/T4TxwDGkrCfTrL6Flg9ktQ_48x48.png", true),
    new ParlayTeam(24, 'LAS VEGAS', 'RAIDERS', 'LV', "https://ssl.gstatic.com/onebox/media/sports/logos/QysqoqJQsTbiJl8sPL12Yg_48x48.png", true),
    new ParlayTeam(25, 'PHILADELPHIA', 'EAGLES', 'PHI', "https://ssl.gstatic.com/onebox/media/sports/logos/s4ab0JjXpDOespDSf9Z14Q_48x48.png", true),
    new ParlayTeam(26, 'PITTSBURGH', 'STEELERS', 'PIT', "https://ssl.gstatic.com/onebox/media/sports/logos/mdUFLAswQ4jZ6V7jXqaxig_48x48.png", true),
    new ParlayTeam(27, 'SAN FRANCISCO', '49ERS', 'SF', "https://ssl.gstatic.com/onebox/media/sports/logos/ku3s7M4k5KMagYcFTCie_g_48x48.png", true),
    new ParlayTeam(28, 'SEATTLE', 'SEAHAWKS', 'SEA', "https://ssl.gstatic.com/onebox/media/sports/logos/iVPY42GLuHmD05DiOvNSVg_48x48.png", true),
    new ParlayTeam(29, 'TAMPA BAY', 'BUCCANEERS', 'TB', "https://ssl.gstatic.com/onebox/media/sports/logos/efP_3b5BgkGE-HMCHx4huQ_48x48.png", true),
    new ParlayTeam(30, 'TENNESSEE', 'TITANS', 'TEN', "https://ssl.gstatic.com/onebox/media/sports/logos/9J9dhhLeSa3syZ1bWXRjaw_48x48.png", true),
    new ParlayTeam(31, 'WASHINGTON', 'COMMANDERS', 'WAS', "https://ssl.gstatic.com/onebox/media/sports/logos/o0CCwss-QfFnJaVdGIHFmQ_48x48.png", true),
    new ParlayTeam(32, 'UNDER', 'UNDER', 'UND', "https://api.iconify.design/mdi/chevron-double-down.svg", false),
    new ParlayTeam(33, 'OVER', 'OVER', 'OVR', "https://api.iconify.design/mdi/chevron-double-up.svg", false),
    new ParlayTeam(34, 'PUSH', 'PUSH', 'PSH', "https://api.iconify.design/mdi/equal.svg", false),
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
