import { Component, OnInit } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { PickDatabaseService } from 'src/app/core/services/pick-database.service';
import { ParlayPick } from './interfaces/parlay-pick.interface';

@Component({
  selector: 'app-picks',
  templateUrl: './picks.component.html',
  styleUrls: ['./picks.component.scss']
})
export class PicksComponent implements OnInit {
  allPicks$!: Observable<ParlayPick[]>;
  selectedPick!: ParlayPick | undefined;

  constructor(
    private readonly pickService: PickDatabaseService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.allPicks$ = this.pickService.getAll();

    // this.pickService.create({
    //   id: 1,
    //   user: 2,
    //   game: 3,
    //   team: 4
    // })
  }
  
  selectPick(pick: ParlayPick) {
    this.selectedPick = pick;
  }

  deletePick() {
    // this.pickService.delete(this.selectedPick!.id);
    this.selectedPick = undefined;
  }

}
