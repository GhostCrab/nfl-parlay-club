import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, filter } from 'rxjs';

import { NFLApiService } from 'src/app/core/services/nfl-api.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';

import {
  getWeekFromAmbig,
  IParlayGame,
} from './interfaces/parlay-game.interface';
import { IParlayPick } from '../picks/interfaces/parlay-pick.interface';
import { PickDatabaseService } from 'src/app/core/services/pick-database.service';
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

  constructor(private readonly gamedb: GameDatabaseService) {}

  async ngOnInit() {
    //const week = 1;
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);
    console.log(`TESTING WEEK ${this.week}`);

    this.allGames$ = this.gamedb.fromWeek(this.week);
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
}
