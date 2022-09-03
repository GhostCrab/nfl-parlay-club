import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable, firstValueFrom } from 'rxjs';

import { GameDatabaseService } from '../../core/services/game-database.service';

import {
  getWeekFromAmbig,
  IParlayGame,
} from '../games/interfaces/parlay-game.interface';
import { IParlayPick } from '../picks/interfaces/parlay-pick.interface';
import { PickDatabaseService } from '../../core/services/pick-database.service';
import { UserDatabaseService } from '../../core/services/user-database.service';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.scss'],
})
export class PickerComponent implements OnInit {
  allGames$: Observable<IParlayGame[]>;
  allPicks$: Observable<IParlayPick[]>;

  week: number;

  constructor(
    private readonly gamedb: GameDatabaseService,
    private readonly pickdb: PickDatabaseService,
    private readonly userdb: UserDatabaseService,
    private location: Location
  ) {}

  async ngOnInit() {
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);
    console.log(`TESTING WEEK ${this.week}`);

    this.allGames$ = this.gamedb.fromWeek(this.week);
    this.allPicks$ = this.pickdb.fromUserWeek(
      this.userdb.currentUser().userID,
      this.week
    );
  }

  async selectPicks(selectdPicks: Array<IParlayPick>) {
    for (const pick of selectdPicks) {
      console.log(`Selected Pick ${pick.toString()}`);
    }

    // get all picks for the week selected
    const currentPicks = await firstValueFrom(
      this.pickdb.fromUserWeek(this.userdb.currentUser().userID, this.week)
    );
    // compare queried picks to submitted picks
    const addedPicks = selectdPicks.filter(
      (x) =>
        !currentPicks.some(
          (y) =>
            x.game.gameID === y.game.gameID &&
            x.team.teamID === y.team.teamID &&
            x.user.userID === y.user.userID
        )
    );
    const removedPicks = currentPicks.filter(
      (x) =>
        !selectdPicks.some(
          (y) =>
            x.game.gameID === y.game.gameID &&
            x.team.teamID === y.team.teamID &&
            x.user.userID === y.user.userID
        )
    );

    await this.pickdb.batchWrite(addedPicks, removedPicks);
    this.location.back();
  }
}
