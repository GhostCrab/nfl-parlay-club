import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ParlayPick } from '../../interfaces/parlay-pick.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  @Input() pick!: ParlayPick;
  @Output() updatePick = new EventEmitter<void>();
  @Output() deletePick = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  update() {
    this.updatePick.emit();
  }

  delete() {
    this.deletePick.emit();
  }
}