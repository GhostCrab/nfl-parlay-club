import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Observable } from 'rxjs';
import { ParlayPick } from '../../interfaces/parlay-pick.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() pick$!: Observable<ParlayPick[]>;
  @Output() pickEmitter = new EventEmitter<ParlayPick>();

  constructor() {}

  ngOnInit(): void {}

  selectPick(pick: ParlayPick) {
    this.pickEmitter.emit(pick);
  }
}