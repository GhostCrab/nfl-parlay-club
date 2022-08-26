import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { ParlayGame } from '../../interfaces/parlay-game.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() games$: Observable<ParlayGame[]>;
  @Output() gameEmitter = new EventEmitter<ParlayGame>();

  constructor() {}

  ngOnInit(): void {}

  selectGame(game: ParlayGame) {
    this.gameEmitter.emit(game);
  }
}
