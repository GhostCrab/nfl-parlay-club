import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import {
  Firestore,
  collectionData,
  docData,
  setDoc,
  writeBatch,
  WriteBatch,
} from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { filter, from, map, Observable, ReplaySubject } from 'rxjs';

import {
  IParlayPick,
  ParlayPick,
} from '../../features/picks/interfaces/parlay-pick.interface';
import { IParlayPickRow } from '../interfaces/parlay-pick-row.interface';
import { GameDatabaseService } from './game-database.service';
import { UserDatabaseService } from './user-database.service';
import { TeamDatabaseService } from './team-database.service';
import { IParlayUser } from 'src/app/features/users/interfaces/parlay-user.interface';
import { user } from '@angular/fire/auth';
import { IParlayGameRow } from '../interfaces/parlay-game-row.interface';

export function pickRowUID(gameID: string, teamID: number, userID: number) {
  function pad(num: number, length = 2) {
    let numstr = num.toString();
    while (numstr.length < length) numstr = '0' + numstr;
    return numstr;
  }

  return `${gameID}${pad(teamID)}${pad(userID, 6)}`;
}

export interface IPickDict {
  user: IParlayUser;
  picks: Observable<IParlayPick[]>;
}

// dictionary of users to array of picks [thursday picks, other picks]
export interface IPickCountDict {
  user: IParlayUser;
  picks: Observable<number[]>;
}

@Injectable({
  providedIn: 'root',
})
export class PickDatabaseService {
  private pickCollection: CollectionReference<DocumentData>;
  private gameCollection: CollectionReference<DocumentData>;
  private allPicks: Map<string, IParlayPickRow>;
  private allPicks$: ReplaySubject<IParlayPickRow[]>;

  initialized: boolean;

  constructor(
    private readonly firestore: Firestore,
    private readonly gamedb: GameDatabaseService,
    private readonly userdb: UserDatabaseService,
    private readonly teamdb: TeamDatabaseService
  ) {
    try {
      this.pickCollection = collection(firestore, 'picks');
      this.gameCollection = collection(firestore, 'games');
    } catch (e) {
      console.log(firestore);
      console.error(e);
    }

    this.initialized = false;
    this.allPicks = new Map<string, IParlayPickRow>();
    this.initializeService();
  }

  initializeService() {
    if (!this.allPicks$) {
      this.allPicks$ = new ReplaySubject(1);

      const pickCD = collectionData(this.pickCollection, {
        idField: 'pickID',
      }) as Observable<IParlayPickRow[]>;

      pickCD.subscribe((data) => {
        this.allPicks$.next(data);
        this.allPicks.clear();
        for (const pickRow of data) {
          this.allPicks.set(pickRow.pickID, pickRow);
        }
        this.initialized = true;
      });

      const gameCD = collectionData(this.gameCollection, {
        idField: 'gameID',
      }) as Observable<IParlayGameRow[]>;

      gameCD.subscribe((data) => {
        this.allPicks$.next(Array.from(this.allPicks.values()));
      });
    }
  }

  getAll(): Observable<IParlayPick[]> {
    return this.allPicks$.pipe(
      map((rows: IParlayPickRow[]) => {
        const result: IParlayPick[] = [];
        for (const row of rows) {
          result.push(
            new ParlayPick(
              row.userID,
              row.gameID,
              row.teamID,
              this.userdb,
              this.gamedb,
              this.teamdb
            )
          );
        }
        return result;
      }),
      map((data) => {
        data.sort(ParlayPick.sort);
        return data;
      })
    );
  }

  fromUserWeek(userID: number, week: number): Observable<IParlayPick[]> {
    return this.allPicks$.pipe(
      map((rows: IParlayPickRow[]) => {
        const result: IParlayPick[] = [];
        for (const row of rows) {
          if (row.userID !== userID) continue;
          const newPick = new ParlayPick(
            row.userID,
            row.gameID,
            row.teamID,
            this.userdb,
            this.gamedb,
            this.teamdb
          );
          if (newPick.game.week !== week) continue;
          result.push(newPick);
        }
        return result;
      }),
      map((data) => {
        data.sort(ParlayPick.sort);
        return data;
      })
    );
  }

  fromUserWeekOther(
    userID: number,
    week: number,
    safeOnly = false
  ): IPickDict[] {
    const dict: IPickDict[] = [];
    for (const user of this.userdb.allUsers()) {
      if (user.userID === userID) continue;

      dict.push({
        user: user,
        picks: this.getAll().pipe(
          map((data) =>
            data.filter(
              (a) =>
                a.user.userID === user.userID &&
                a.game.week === week &&
                (a.isSafeToSee() || !safeOnly)
            )
          )
        ),
      });
    }

    return dict;
  }

  fromUserWeekOtherCount(
    userID: number,
    week: number,
    safeOnly = false
  ): IPickCountDict[] {
    const dict: IPickCountDict[] = [];
    for (const user of this.userdb.allUsers()) {
      if (user.userID === userID) continue;

      dict.push({
        user: user,
        picks: this.getAll().pipe(
          map((data) => {
            const pickCounts = [0, 0];
            const filteredData = data.filter(
              (a) => a.user.userID === user.userID && a.game.week === week
            );

            for (const pick of filteredData) {
              if (pick.game.isThursdayGame()) pickCounts[0]++;
              else pickCounts[1]++;
            }

            return pickCounts;
          })
        ),
      });
    }

    return dict;
  }

  addPick(pick: IParlayPick, batch?: WriteBatch) {
    console.log(`Adding pick to db: ${pick.toString()}`);
    const pickRow = pick.toParlayPickRow();
    const pickDocumentReference = doc(this.pickCollection, pickRow.pickID);

    if (batch) return batch.set(pickDocumentReference, pickRow);

    return setDoc(pickDocumentReference, pickRow);
  }

  removePick(pick: IParlayPick, batch?: WriteBatch) {
    console.log(`Removing pick from db: ${pick.toString()}`);
    const pickRow = pick.toParlayPickRow();
    const pickDocumentReference = doc(this.pickCollection, pickRow.pickID);

    if (batch) return batch.delete(pickDocumentReference);

    return deleteDoc(pickDocumentReference);
  }

  batchWrite(addedPicks: IParlayPick[], removedPicks: IParlayPick[]) {
    if (addedPicks.length === 0 && removedPicks.length == 0) return;

    const batch = writeBatch(this.firestore);

    for (const pick of addedPicks) {
      this.addPick(pick, batch);
    }

    for (const pick of removedPicks) {
      this.removePick(pick, batch);
    }

    return batch.commit();
  }
}
