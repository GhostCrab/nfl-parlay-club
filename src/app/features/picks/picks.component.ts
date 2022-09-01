import { Component, OnInit } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { PickDatabaseService } from 'src/app/core/services/pick-database.service';
import { ParlayPick } from './interfaces/parlay-pick.interface';
import { getWeekFromAmbig } from '../games/interfaces/parlay-game.interface';

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
    private readonly pickService: PickDatabaseService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.week = Math.max(getWeekFromAmbig(new Date()), 1);

    this.allPicks$ = this.pickService.getAll();
  }
}
