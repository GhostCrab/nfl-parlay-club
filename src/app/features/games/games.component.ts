import { Component, OnInit } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

import { NFLApiService } from 'src/app/core/services/nfl-api.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';

import {
  getWeekFromAmbig,
  IParlayGame,
} from './interfaces/parlay-game.interface';
import { ParlayPick } from '../picks/interfaces/parlay-pick.interface';

const rounds = [
  'Preseason Week 1',
  'Preseason Week 2',
  'Preseason Week 3',
  'Week 1',
  'Week 2',
  'Week 3',
  'Week 4',
  'Week 5',
  'Week 6',
  'Week 7',
  'Week 8',
  'Week 9',
  'Week 10',
  'Week 11',
  'Week 12',
  'Week 13',
  'Week 14',
  'Week 15',
  'Week 16',
  'Week 17',
  'Week 18',
];

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
  ) {}

  async ngOnInit(): Promise<void> {
    //const week = 1;
    const week = Math.max(getWeekFromAmbig(new Date()), 1);
    console.log(`TESTING WEEK ${week}`);

    this.allGames$ = this.gamedb.getAll();

    const dbgames = await firstValueFrom(this.gamedb.getAll());
    const apigames = await firstValueFrom(this.nfl.getGames(week, true));

    for (const apigame of apigames) {
      // find game in dbgames
      const dbgame = dbgames.find((dbgame) => {
        return (
          dbgame.home.teamID === apigame.home.teamID &&
          dbgame.week === apigame.week
        );
      });

      if (dbgame) {
        dbgame.updateScoreAndDate(apigame);
        dbgame.updateOdds(apigame);
        // console.log(
        //   `Found and updated W${dbgame.week} ${dbgame.away.abbr} @ ${dbgame.home.abbr}`
        // );
        this.gamedb.updateGame(dbgame);
      } else {
        // console.log(
        //   `Unable to find W${apigame.week} ${apigame.away.abbr} @ ${apigame.home.abbr} in db`
        // );
        this.gamedb.addGame(apigame);
        console.log(`Added new game: `);
        console.log(apigame);
      }
    }

    // const newgames = await firstValueFrom(this.gamedb.getAll());
    // console.log(newgames);

    // for (const dbgame of dbgames) {
    //   this.gamedb.delete(dbgame.gameID);
    // }
  }

  //game: IParlayGame, team: ParlayTeam
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
