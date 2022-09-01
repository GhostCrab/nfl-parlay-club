import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';

import { Injectable } from '@angular/core';
import { filter, map, Observable, ReplaySubject } from 'rxjs';

import {
  IParlayPick,
  ParlayPick,
} from '../../features/picks/interfaces/parlay-pick.interface';
import { IParlayPickRow } from '../interfaces/parlay-pick-row.interface';
import { GameDatabaseService } from './game-database.service';
import { UserDatabaseService } from './user-database.service';
import { TeamDatabaseService } from './team-database.service';

function pickRowUID(pick: IParlayPickRow) {
  function pad(num: number, length = 2) {
    let numstr = num.toString();
    while (numstr.length < length) numstr = '0' + num;
    return numstr;
  }

  return `${pick.gameID}${pad(pick.teamID)}${pad(pick.userID, 6)}`;
}

@Injectable({
  providedIn: 'root',
})
export class PickDatabaseService {
  private pickCollection: CollectionReference<DocumentData>;
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

      const cd = collectionData(this.pickCollection, {
        idField: 'pickID',
      }) as Observable<IParlayPickRow[]>;

      cd.subscribe((data) => {
        this.allPicks$.next(data);
        this.allPicks.clear();
        for (const pickRow of data) {
          this.allPicks.set(pickRowUID(pickRow), pickRow);
        }
        this.initialized = true;
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
    return this.getAll().pipe(map(data => data.filter(a => a.user.userID === userID && a.game.week === week)))
  }

  get(id: number) {
    const pickDocumentReference = doc(this.firestore, `picks/${id}`);
    return docData(pickDocumentReference, { idField: 'id' });
  }

  create(pick: IParlayPick) {
    return addDoc(this.pickCollection, pick);
  }

  update(pick: IParlayPick) {
    const pickDocumentReference = doc(
      this.firestore,
      `picks/${pick.user.userID}`
    );
    return updateDoc(pickDocumentReference, { ...pick });
  }

  delete(id: number) {
    const pickDocumentReference = doc(this.firestore, `picks/${id}`);
    return deleteDoc(pickDocumentReference);
  }
}
