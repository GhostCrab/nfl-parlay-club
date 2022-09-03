import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';
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
  allGames$: Observable<IParlayGame[]>;
  myPicks$: Observable<IParlayPick[]>;
  otherPicks: IPickDict[];

  week: number;

  constructor(
    private readonly gamedb: GameDatabaseService,
    private readonly pickdb: PickDatabaseService,
    private readonly userdb: UserDatabaseService
  ) {}

  ngOnInit(): void {
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);

    this.allGames$ = this.gamedb.fromWeek(this.week);
    this.myPicks$ = this.pickdb.fromUserWeek(
      this.userdb.currentUser().userID,
      this.week
    );

    this.otherPicks = this.pickdb.fromUserWeekOtherSafe(
      this.userdb.currentUser().userID,
      this.week
    );
  }
}
