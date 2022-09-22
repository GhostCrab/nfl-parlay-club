import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
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
export class DashboardComponent implements OnInit, OnDestroy {
  allGamesSub$: BehaviorSubject<IParlayGame[]>;
  allGames$: Observable<IParlayGame[]>;
  allPicks$: Observable<IParlayPick[]>;
  myPicks$: Observable<IParlayPick[]>;
  otherPicks: IPickDict[];

  weeks: number[];
  week: number;
  userID: number;

  updateInterval: NodeJS.Timer;

  constructor(
    private readonly pickdb: PickDatabaseService,
    private readonly userdb: UserDatabaseService,
    private readonly nflapi: NFLApiService,
  ) {
    this.weeks = [...Array(18).keys()].map(x => x+1);
    this.week = Number(localStorage['week']);
  }

  ngOnDestroy(): void {
    console.log("Shutting down dashboard update")
    clearInterval(this.updateInterval);
  }

  async ngOnInit(): Promise<void> {
    this.userID = this.userdb.currentUser().userID;
    
    this.allPicks$ = this.pickdb.getAll();

    this.setPicks();

    this.allGamesSub$ = new BehaviorSubject(new Array<IParlayGame>());
    this.allGames$ = this.allGamesSub$.asObservable();

    const games = await this.updateGames();
    this.allGamesSub$.next(games);

    this.updateInterval = setInterval(async () => {
      const games = await this.updateGames();
      this.allGamesSub$.next(games);
    }, 20000)
  }

  async updateGames(): Promise<IParlayGame[]> {
    return this.nflapi.updateGames(this.week, true);
  }

  setPicks(): void {
    this.myPicks$ = this.pickdb.fromUserWeek(
      this.userdb.currentUser().userID,
      this.week
    );

    this.otherPicks = this.pickdb.fromUserWeekOther(
      this.userdb.currentUser().userID,
      this.week
    );
  }

  async updateClick(): Promise<void> {
    const games = await this.updateGames();
    this.allGamesSub$.next(games);
  }

  async hardWaitAndRefresh() {
    this.allGamesSub$.next([]);
    this.myPicks$ = from([]);
    this.otherPicks = [];
    
    this.week = Number(localStorage['week']);
    const games = await this.updateGames();
    this.allGamesSub$.next(games);
    this.setPicks();
  }

  selectWeek(event: Event) {
    this.week = Number((event.target as HTMLSelectElement).value);
    localStorage['week'] = this.week;
    this.hardWaitAndRefresh();
  }
}
