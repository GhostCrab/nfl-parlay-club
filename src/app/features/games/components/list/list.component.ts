import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IParlayGame } from '../../interfaces/parlay-game.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() games$: Observable<IParlayGame[]>;

  constructor() { }

  ngOnInit(): void {
  }

}
