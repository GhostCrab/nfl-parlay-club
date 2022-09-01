import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, filter } from 'rxjs';

import { NFLApiService } from 'src/app/core/services/nfl-api.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';

import {
  getWeekFromAmbig,
  IParlayGame,
} from './interfaces/parlay-game.interface';
import { IParlayPick, ParlayPick } from '../picks/interfaces/parlay-pick.interface';
import { PickDatabaseService } from 'src/app/core/services/pick-database.service';
import { Auth } from '@angular/fire/auth';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  allGames$: Observable<IParlayGame[]>;
  selectedGame?: IParlayGame;

  week: number;

  constructor(
    private readonly nfl: NFLApiService,
    private readonly teamdb: TeamDatabaseService,
    private readonly gamedb: GameDatabaseService,
    private readonly pickdb: PickDatabaseService,
    private readonly userdb: UserDatabaseService,
  ) {}

  async ngOnInit() {
    //const week = 1;
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);
    console.log(`TESTING WEEK ${this.week}`);

    this.allGames$ = this.gamedb.fromWeek(this.week);

    this.pickdb.fromUserWeek(this.userdb.currentUser().userID, this.week).subscribe(data => console.log(data));
  }

  async updateAll() {
    for (const week in [...Array(18).keys()]) {
      const weekNum = Number(week) + 1;
      console.log(`Updating Week ${weekNum}`);
      await this.gamedb.updateWeek(weekNum);
    }
  }

  async deleteAll() {
    const dbgames = await firstValueFrom(this.gamedb.getAll());
    for (const dbgame of dbgames) {
      this.gamedb.delete(dbgame.gameID);
    }
  }

  async selectPicks(picks: Array<IParlayPick>) {
    for (const pick of picks) {
      console.log(`Selected Pick ${pick.toString()}`);
    }

    // get all picks for the week selected
    const currentPicks = await firstValueFrom(this.pickdb.fromUserWeek(this.userdb.currentUser().userID, this.week));
    // compare queried picks to submitted picks
    // remove missing picks
    // add new picks

  }
}
