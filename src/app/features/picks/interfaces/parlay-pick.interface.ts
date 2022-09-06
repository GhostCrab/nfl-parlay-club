import { IParlayPickRow } from 'src/app/core/interfaces/parlay-pick-row.interface';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';
import { pickRowUID } from 'src/app/core/services/pick-database.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import { IParlayGame } from '../../games/interfaces/parlay-game.interface';
import { IParlayTeam } from '../../teams/interfaces/parlay-team.interface';
import { IParlayUser } from '../../users/interfaces/parlay-user.interface';

export interface IParlayPick {
  user: IParlayUser;
  game: IParlayGame;
  team: IParlayTeam;

  toString(): string;
  toParlayPickRow(): IParlayPickRow;
  isSafeToSee(): boolean;
  success(): boolean;
}

export class ParlayPick implements IParlayPick {
  user: IParlayUser;
  game: IParlayGame;
  team: IParlayTeam;

  constructor(
    userID: number,
    gameID: string,
    teamID: number,
    private readonly userdb: UserDatabaseService,
    private readonly gamedb: GameDatabaseService,
    private readonly teamdb: TeamDatabaseService
  ) {
    this.user = this.userdb.fromID(userID);
    this.game = this.gamedb.fromID(gameID);
    this.team = this.teamdb.fromID(teamID);
  }

  toString() {
    if (this.team.isOU())
      return `${this.user.name}: W${this.game.week} ${this.game.away.abbr} @ ${this.game.home.abbr} [${this.team.name} +${this.game.ou}]`;

    if (this.game.fav.teamID === this.team.teamID)
      return `${this.user.name}: W${this.game.week} ${this.game.away.abbr} @ ${this.game.home.abbr} [${this.team.abbr} ${this.game.spread}]`;

    return `${this.user.name}: W${this.game.week} ${this.game.away.abbr} @ ${
      this.game.home.abbr
    } [${this.team.abbr} +${-this.game.spread}]`;
  }

  static sort(a: IParlayPick, b: IParlayPick): number {
    if (a.user.userID !== b.user.userID) {
      return b.user.userID - a.user.userID;
    }
    if (a.game.gt.getTime() - b.game.gt.getTime() !== 0) {
      return a.game.gt.getTime() - b.game.gt.getTime();
    }
    return a.game.away.name.localeCompare(b.game.away.name);
  }

  toParlayPickRow(): IParlayPickRow {
    return {
      pickID: pickRowUID(this.game.gameID, this.team.teamID, this.user.userID),
      gameID: this.game.gameID,
      teamID: this.team.teamID,
      userID: this.user.userID,
    };
  }

  isSafeToSee(): boolean {
    if (this.user.userID === this.userdb.currentUser().userID) return true;
    // picks are safe to see if game has started or sunday games have started for this week
    //const now = new Date('2022-09-12T07:00:00Z');
    //const now = new Date('2022-09-09T07:00:00Z');
    const now = new Date();
    console.log('now:' + now.toLocaleString());
    console.log('safe:' + this.game.safeTime().toLocaleString());

    return now >= this.game.safeTime();
  }

  success(): boolean {
    return true;
  }
}
