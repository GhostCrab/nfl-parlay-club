import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApplicationStateService } from 'src/app/core/services/application-state.service';
import { IParlayGame } from '../../games/interfaces/parlay-game.interface';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit {
  @Input() games$: Observable<IParlayGame[]>;

  isMobile: boolean;

  constructor(private readonly appState: ApplicationStateService) {
    this.isMobile = appState.getIsMobileResolution();
  }

  ngOnInit(): void {
  }

}
