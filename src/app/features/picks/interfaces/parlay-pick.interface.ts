import { IParlayGame } from "../../games/interfaces/parlay-game.interface";
import { IParlayTeam } from "../../teams/interfaces/parlay-team.interface";
import { IParlayUser } from "../../users/interfaces/parlay-user.interface";

export interface IParlayPick {
  user: IParlayUser;
  game: IParlayGame;
  team: IParlayTeam;
}

export class ParlayPick implements IParlayPick {
  user: IParlayUser;
  game: IParlayGame;
  team: IParlayTeam;

  constructor(user: IParlayUser, game: IParlayGame, team: IParlayTeam) {
    this.user = user;
    this.game = game;
    this.team = team;
  }  
}