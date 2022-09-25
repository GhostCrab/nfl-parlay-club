import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDatabaseService } from 'src/app/core/services/user-database.service';
import { IParlayGame } from '../../games/interfaces/parlay-game.interface';
import { IParlayPick, PickStatus } from '../../picks/interfaces/parlay-pick.interface';

@Component({
  selector: 'app-score-list',
  templateUrl: './score-list.component.html',
  styleUrls: ['./score-list.component.css'],
})
export class ScoreListComponent implements OnInit {
  @Input() picks$: Observable<IParlayPick[]>;
  @Input() games$: Observable<IParlayGame[]>;

  picks: IParlayPick[];
  games: IParlayGame[];

  scoreSubject$: BehaviorSubject<[string, number][]>;
  scores$: Observable<[string, number][]>;
  scores: Record<string, number>;

  constructor(private readonly userdb: UserDatabaseService) {
    this.picks = [];
    this.games = [];
    this.scores = {};
  }

  ngOnInit(): void {
    const tmpScores: [string, number][] = [];
    for (const user of this.userdb.allUsers()) {
      this.scores[user.name] = 0;
      tmpScores.push([user.name, 0]);
    }
    this.scoreSubject$ = new BehaviorSubject(tmpScores);
    this.scores$ = this.scoreSubject$.asObservable();

    this.picks$.subscribe((data) => {
      this.picks = data;
      this.updateScore();
    });

    this.games$.subscribe((data) => {
      this.games = data;
      this.updateScore();
    });
  }

  updateScore(): void {
    for (const user of this.userdb.allUsers()) {
      this.scores[user.name] = 0;
    }

    for (const user of this.userdb.allUsers()) {
      // get all picks by this user
      const picks = this.picks.filter((a) => a.user.userID === user.userID);

      // for each pick by the user, collect by week
      // weeks 1-18 are normal weeks, week 0 is bonus opening day and week 19 is thanksgiving
      const picksByWeek: Array<Array<IParlayPick>> = [];

      for (let i = 0; i < 20; i++) {
        picksByWeek.push([]);
      }

      for (const pick of picks) {
        if (pick.game.week === 1 && pick.game.isThursdayGame()) {
          picksByWeek[0].push(pick);
        } else if (pick.game.week === 12 && pick.game.isThursdayGame()) {
          picksByWeek[19].push(pick);
        } else {
          picksByWeek[pick.game.week].push(pick);
        }
      }

      // for each week's picks, see if points were gained, add to total score
      for (const weekPicks of picksByWeek) {
        let tally = 0;
        for (const pick of weekPicks) {
          const ps = pick.success();
          if (ps === PickStatus.Success) {
            tally++;
          } else if (ps === PickStatus.Fail || ps === PickStatus.Incomplete) {
            tally = 0;
            break;
          }
        }

        if (weekPicks.length > 0)
          console.log(`${user.name} W${weekPicks[0].game.week}: ${this.scores[user.name]} + ${tally}`)
        this.scores[user.name] += tally;
        //this.scores[user.name] += Math.floor(Math.random() * 10);
      }
    }

    const tmpScores: [string, number][] = [];
    for (const [name, score] of Object.entries(this.scores).sort((a, b) => {
      if (a[1] === b[1]) return a[0].localeCompare(b[0]);
      return b[1] - a[1];
    })) {
      tmpScores.push([name, score]);
    }
    this.scoreSubject$.next(tmpScores);
  }
}
