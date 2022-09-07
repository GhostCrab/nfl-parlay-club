import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApplicationStateService } from 'src/app/core/services/application-state.service';
import { IParlayPick } from '../../picks/interfaces/parlay-pick.interface';

@Component({
  selector: 'app-picks-list',
  templateUrl: './picks-list.component.html',
  styleUrls: ['./picks-list.component.css']
})
export class PicksListComponent implements OnInit {
  @Input() picks$: Observable<IParlayPick[]>;
  
  thursdayPicksSafe$: Observable<IParlayPick[]>;
  thursdayPickCount$: Observable<number>;
  otherPicksSafe$: Observable<IParlayPick[]>;
  otherPickCount$: Observable<number>;
  isMobile: boolean;

  constructor(private readonly appState: ApplicationStateService) {
    this.isMobile = appState.getIsMobileResolution();
  }

  ngOnInit(): void {
    this.thursdayPicksSafe$ = this.picks$.pipe(map(data => data.filter(a => a.game.isThursdayGame() && a.isSafeToSee())));
    this.thursdayPickCount$ = this.picks$.pipe(map(data => data.filter(a => a.game.isThursdayGame()).length));
    this.otherPicksSafe$ = this.picks$.pipe(map(data => data.filter(a => !a.game.isThursdayGame() && a.isSafeToSee())));
    this.otherPickCount$ = this.picks$.pipe(map(data => data.filter(a => !a.game.isThursdayGame()).length));
  }

}
