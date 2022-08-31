import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import { ParlayPick } from 'src/app/features/picks/interfaces/parlay-pick.interface';
import { ParlayTeam } from 'src/app/features/teams/interfaces/parlay-team.interface';

import { IParlayGame } from '../../interfaces/parlay-game.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Input() games$: Observable<IParlayGame[]>;
  @Output() pickEmitter = new EventEmitter<Array<ParlayPick>>();

  games: Record<string, IParlayGame>;
  checked: Record<string, Record<number, boolean>>;
  disabled: Record<string, boolean>;
  constructor(
    private readonly teamdb: TeamDatabaseService,
    private readonly gamedb: GameDatabaseService,
    private readonly userdb: UserDatabaseService
  ) {}

  ngOnInit(): void {
    this.checked = {};
    this.disabled = {};
    this.games = {};

    this.games$.subscribe((data) => {
      const now = new Date(`September 9, 2022 12:00:00 PM`);
      for (const game of data) {
        this.disabled[game.gameID] = now > game.gt;

        this.games[game.gameID] = game;
      }      
    });
  }

  selectPick(
    event: MatCheckboxChange,
    game: IParlayGame,
    team: ParlayTeam | string
  ) {
    if (typeof team === 'string') {
      team = this.teamdb.fromName(team);
    }

    if (event.checked) {
      console.log(
        `Selected W${game.week} ${game.away.abbr} @ ${game.home.abbr}: ${team.abbr}`
      );

      // uncheck opposing pick
      // get opposing team id
      let oppoTeamID = game.away.teamID;
      if (team.teamID === game.away.teamID) oppoTeamID = game.home.teamID;

      // check if is an OU pick
      if (team.teamID >= 32) {
        oppoTeamID = 32;
        if (team.teamID === 32) oppoTeamID = 33;
      }

      if (!this.checked[game.gameID]) {
        this.checked[game.gameID] = {};
      }

      this.checked[game.gameID][team.teamID] = true;
      this.checked[game.gameID][oppoTeamID] = false;
    } else {
      console.log(
        `Unselected W${game.week} ${game.away.abbr} @ ${game.home.abbr}: ${team.abbr}`
      );

      if (!this.checked[game.gameID]) {
        this.checked[game.gameID] = {};
      }
      this.checked[game.gameID][team.teamID] = false;
    }

    //this.gameEmitter.emit([game, team]);
  }

  clear() {
    for (const gameID in this.checked) {
      for (const teamID in this.checked[gameID])
        this.checked[gameID][teamID] = false;
    }
  }

  submit() {
    const allPicks: Array<ParlayPick> = new Array<ParlayPick>();
    for (const gameID in this.checked) {
      for (const teamID in this.checked[gameID]) {
        if (this.checked[gameID][teamID]) {
          allPicks.push(
            new ParlayPick(this.userdb.fromID(1), this.games[gameID], this.teamdb.fromID(~~teamID))
          );
        }
      }
    }

    if (allPicks.length > 0) this.pickEmitter.emit(allPicks);
  }
}
