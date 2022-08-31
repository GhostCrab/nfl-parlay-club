import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom, map, filter } from 'rxjs';

import { NFLApiService } from 'src/app/core/services/nfl-api.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';

import {
  getWeekFromAmbig,
  IParlayGame,
} from './interfaces/parlay-game.interface';
import { ParlayPick } from '../picks/interfaces/parlay-pick.interface';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  allGames$: Observable<IParlayGame[]>;
  selectedGame?: IParlayGame;

  constructor(
    private readonly nfl: NFLApiService,
    private readonly teamdb: TeamDatabaseService,
    private readonly gamedb: GameDatabaseService
  ) {
    this.allGames$ = this.gamedb.getAll().pipe(
      map((data) => {
        return data.filter((a) => a.week === 1);
      })
    );
  }

  async ngOnInit(): Promise<void> {
    //const week = 1;
    const week = Math.max(getWeekFromAmbig(new Date()), 1);
    console.log(`TESTING WEEK ${week}`);

    const dbgames = await firstValueFrom(this.gamedb.getAll());
    console.log(dbgames);

    for (const week in [...Array(2).keys()]) {
      const weekNum = Number(week) + 1;
      console.log(`Updating Week ${weekNum}`);
      await this.gamedb.updateWeek(weekNum);
    }

    const dbgames2 = await firstValueFrom(this.gamedb.getAll());
    console.log(dbgames2);

    // for (const dbgame of dbgames) {
    //   this.gamedb.delete(dbgame.gameID);
    // }
  }

  selectPicks(picks: Array<ParlayPick>) {
    for (const pick of picks) {
      if (pick.team.isOU()) {
        console.log(
          `Selected Pick ${pick.game.away.abbr} @ ${pick.game.home.abbr}: ${pick.team.name} +${pick.game.ou}`
        );
      } else {
        if (pick.game.fav.teamID === pick.team.teamID)
          console.log(
            `Selected Pick ${pick.game.away.abbr} @ ${pick.game.home.abbr}: ${pick.team.abbr} ${pick.game.spread}`
          );
        else
          console.log(
            `Selected Pick ${pick.game.away.abbr} @ ${pick.game.home.abbr}: ${
              pick.team.abbr
            } +${-pick.game.spread}`
          );
      }
    }
  }
}
