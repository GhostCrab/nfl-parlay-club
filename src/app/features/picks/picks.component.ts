import { Component, OnInit } from '@angular/core';
import { Observable, filter, tap } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { FormComponent } from './components/form/form.component';
import { PickDatabaseService } from 'src/app/core/pick-database.service';
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

  addPick() {
    const dialogRef = this.dialog.open(FormComponent, {
      data: {},
      width: '40%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((pick) => this.pickService.create(pick))
      )
      .subscribe();
  }

  updatePick() {
    const dialogRef = this.dialog.open(FormComponent, {
      data: { ...this.selectedPick },
      width: '40%',
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter(Boolean),
        tap((pick) => this.pickService.update(pick)),
        tap((pick) => this.selectPick(pick))
      )
      .subscribe();
  }

  selectPick(pick: ParlayPick) {
    this.selectedPick = pick;
  }

  deletePick() {
    // this.pickService.delete(this.selectedPick!.id);
    this.selectedPick = undefined;
  }

}
