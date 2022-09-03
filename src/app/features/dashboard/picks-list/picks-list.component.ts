import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IParlayPick } from '../../picks/interfaces/parlay-pick.interface';

@Component({
  selector: 'app-picks-list',
  templateUrl: './picks-list.component.html',
  styleUrls: ['./picks-list.component.css']
})
export class PicksListComponent implements OnInit {
  @Input() picks$: Observable<IParlayPick[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
