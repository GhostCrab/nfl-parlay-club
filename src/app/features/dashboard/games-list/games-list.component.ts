import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IParlayGame } from '../../games/interfaces/parlay-game.interface';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit {
  @Input() games$: Observable<IParlayGame[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
