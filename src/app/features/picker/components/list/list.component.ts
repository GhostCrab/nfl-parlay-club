import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { map, Observable } from 'rxjs';
import { GameDatabaseService } from 'src/app/core/services/game-database.service';
import { TeamDatabaseService } from 'src/app/core/services/team-database.service';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import { IParlayPick, ParlayPick } from 'src/app/features/picks/interfaces/parlay-pick.interface';
import { ParlayTeam } from 'src/app/features/teams/interfaces/parlay-team.interface';

import { IParlayGame } from '../../../games/interfaces/parlay-game.interface';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  @Input() games$: Observable<IParlayGame[]>;
  @Input() picks$: Observable<IParlayPick[]>;
  @Output() pickEmitter = new EventEmitter<Array<ParlayPick>>();

  games: Record<string, IParlayGame>;
  checked: Record<string, Record<number, boolean>>;
  disabled: Record<string, boolean>;
  constructor(
    private readonly teamdb: TeamDatabaseService,
    private readonly gamedb: GameDatabaseService,
    private readonly userdb: UserDatabaseService,
    private readonly auth: Auth
  ) {}

  ngOnInit(): void {
    this.checked = {};
    this.disabled = {};
    this.games = {};

    this.games$.subscribe((data) => {
      const now = new Date();
      for (const game of data) {
        this.disabled[game.gameID] = now > game.gt;

        this.games[game.gameID] = game;
      }
    });

    this.picks$.subscribe((data) => {
      this.clear();
      for (const pick of data) {
        if (!this.checked[pick.game.gameID]) {
          this.checked[pick.game.gameID] = {};
        }
        this.checked[pick.game.gameID][pick.team.teamID] = true;
      }
    })
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
            new ParlayPick(
              this.userdb.fromAmbig(this.auth.currentUser?.email).userID,
              this.games[gameID].gameID,
              ~~teamID,
              this.userdb,
              this.gamedb,
              this.teamdb
            )
          );
        }
      }
    }

    this.pickEmitter.emit(allPicks);
  }
}
