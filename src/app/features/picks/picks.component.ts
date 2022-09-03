import { Component, OnInit } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { PickDatabaseService } from 'src/app/core/services/pick-database.service';
import { ParlayPick } from './interfaces/parlay-pick.interface';
import { getWeekFromAmbig } from '../games/interfaces/parlay-game.interface';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.scss']
})
export class PicksComponent implements OnInit {
  allPicks$!: Observable<ParlayPick[]>;
  selectedPick!: ParlayPick | undefined;

  week: number;

  constructor(
    private readonly pickdb: PickDatabaseService,
    private readonly userdb: UserDatabaseService
  ) {}

  ngOnInit(): void {
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);

    this.allPicks$ = this.pickdb.fromUserWeek(
      this.userdb.currentUser().userID,
      this.week
    );
  }
}
