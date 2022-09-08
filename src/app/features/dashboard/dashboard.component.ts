import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';
import { NFLApiService } from 'src/app/core/services/nfl-api.service';
import { IPickDict, PickDatabaseService } from 'src/app/core/services/pick-database.service';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import {
  getWeekFromAmbig,
  IParlayGame,
} from '../games/interfaces/parlay-game.interface';
import { IParlayPick } from '../picks/interfaces/parlay-pick.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  allGamesSub$: BehaviorSubject<IParlayGame[]>;
  allGames$: Observable<IParlayGame[]>;
  allPicks$: Observable<IParlayPick[]>;
  myPicks$: Observable<IParlayPick[]>;
  otherPicks: IPickDict[];

  week: number;
  userID: number;

  constructor(
    private readonly gamedb: GameDatabaseService,
    private readonly pickdb: PickDatabaseService,
    private readonly userdb: UserDatabaseService,
    private readonly nflapi: NFLApiService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.userID = this.userdb.currentUser().userID;
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);

    this.allPicks$ = this.pickdb.getAll();

    this.myPicks$ = this.pickdb.fromUserWeek(
      this.userdb.currentUser().userID,
      this.week
    );

    this.otherPicks = this.pickdb.fromUserWeekOther(
      this.userdb.currentUser().userID,
      this.week
    );

    this.allGamesSub$ = new BehaviorSubject(new Array<IParlayGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    const games = await this.updateGames();
    this.allGamesSub$.next(games);

    setInterval(async () => {
      const games = await this.updateGames();
      this.allGamesSub$.next(games);
    }, 20000)
  }

  async updateGames(): Promise<IParlayGame[]> {
    return this.nflapi.updateGames(this.week, true);
  }

  async updateClick(): Promise<void> {
    const games = await this.updateGames();
    this.allGamesSub$.next(games);
  }
}
