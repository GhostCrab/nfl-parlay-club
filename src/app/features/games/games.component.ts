import { Component, OnInit } from '@angular/core';
import {
  Observable,
  filter,
  tap,
  map,
  mergeMap,
  forkJoin,
  merge,
  lastValueFrom,
  firstValueFrom,
} from 'rxjs';

import { NFLApiService } from 'src/app/core/nfl-api.service';
import { TeamDatabaseService } from 'src/app/core/team-database.service';
import { GameDatabaseService } from 'src/app/core/game-database.service';

import { IParlayGame, ParlayGame } from './interfaces/parlay-game.interface';
import { IParlayGameRow } from 'src/app/core/interfaces/parlay-game-row.interface';

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
  styleUrls: ['./games.component.css'],
})
export class GamesComponent implements OnInit {
  allGames$: Observable<IParlayGame[]>;

  constructor(
    private readonly nfl: NFLApiService,
    private readonly teamdb: TeamDatabaseService,
    private readonly gamedb: GameDatabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('TESTING GAMES');
    const week = 1;

    // this.allGames$ = this.gamedb.getAll();
    // this.allGames$.subscribe(data => {console.log(data)})

    const dbgames = await firstValueFrom(this.gamedb.getAll());
    for (const dbgame of dbgames) {
      this.gamedb.delete(dbgame.gameID);
    }

    const apigames = await firstValueFrom(this.nfl.getGames(week));

    for (const apigame of apigames) {
      // find game in dbgames
      const dbgame = dbgames.find((dbgame) => {
        return (
          dbgame.home.teamID === apigame.home.teamID && dbgame.week === apigame.week
        );
      });

      if (dbgame) {
        dbgame.updateScoreAndDate(apigame);
        console.log(
          `Found and updated W${dbgame.week} ${dbgame.away.abbr} @ ${dbgame.home.abbr}`
        );
      } else {
        console.log(
          `Unable to find W${apigame.week} ${apigame.away.abbr} @ ${apigame.home.abbr} in db`
        );
        this.gamedb.addGame(apigame);
        console.log(`Added new game:`);
        console.log(apigame);
      }
    }
    console.log('TERSTT');

    // this.gamedb.getAll().subscribe((dbgames) => {
    //   this.nfl.getGames(week).subscribe((nflgames) => {
    //     console.log(dbgames);
    //     console.log(nflgames);
    //     for (const game of nflgames) {
    //       // find game in dbgames
    //       const dbgame = dbgames.find((dbgame) => {
    //         return dbgame.home.teamID === game.home.teamID && dbgame.week === game.week;
    //       });

    //       if (dbgame) {
    //         dbgame.updateScoreAndDate(game);
    //         console.log(`Found and updated W${dbgame.week} ${dbgame.away.abbr} @ ${dbgame.home.abbr}`);
    //       }
    //       else {
    //         console.log(`Unable to find W${game.week} ${game.away.abbr} @ ${game.home.abbr} in db`);
    //         this.gamedb.addGame(game);
    //         console.log(`Added new game:`);
    //         console.log(game);
    //       }
    //     }
    //   });
    // });

    // this.gamedb.fromTeamDate("FALCONS", 2).subscribe(data => {
    //   console.log(data);
    // });

    if (false) {
      this.allGames$ = this.nfl.getData(`Week ${week}`).pipe(
        map((data) => {
          console.log(data);
          const games: ParlayGame[] = [];
          for (const result of data.results) {
            const game = new ParlayGame(
              result.team2Name,
              result.team1Name,
              result.date,
              this.teamdb
            );
            this.gamedb.addGame(game);
            game.updateFromAPI(result);
            games.push(game);
          }
          return games;
        })
      );

      this.allGames$.subscribe((data) => {
        console.log(data);
      });
    }
  }
}
