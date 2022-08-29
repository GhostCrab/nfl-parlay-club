import { Injectable, Query } from '@angular/core';
import { Observable, from, map } from 'rxjs';

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
  collectionGroup,
  query,
  where,
  getDocs,
} from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  IParlayTeam,
  ParlayTeam,
} from '../features/teams/interfaces/parlay-team.interface';
import {
  getWeekFromAmbig,
  getWeekFromDate,
  IParlayGame,
  ParlayGame,
} from '../features/games/interfaces/parlay-game.interface';
import { IParlayGameRow } from './interfaces/parlay-game-row.interface';
import { TeamDatabaseService } from './team-database.service';

@Injectable({
  providedIn: 'root',
})
export class GameDatabaseService {
  private gameCollection: CollectionReference<DocumentData>;

  constructor(
    private readonly firestore: Firestore,
    private readonly teamdb: TeamDatabaseService
  ) {
    try {
      this.gameCollection = collection(firestore, 'games');
    } catch (e) {
      console.log(firestore);
      console.error(e);
    }
  }

  getAll() {
    const cd = collectionData(this.gameCollection, {
      idField: 'gameID',
    }) as Observable<IParlayGameRow[]>;

    return cd.pipe(map((rows: IParlayGameRow[]) => {
      const result: IParlayGame[] = [];
      for (const row of rows) {
        result.push(new ParlayGame(row, this.teamdb))
      }
      return result;
    }));
  }

  get(id: string) {
    const pickDocumentReference = doc(this.gameCollection, id);
    return docData(pickDocumentReference, { idField: 'gameID' });
  }

  fromWeek(date: number | Date, season: number = 2022) {
    const week = getWeekFromAmbig(date);

    const cg = collectionGroup(this.firestore, this.gameCollection.id);
    const constraints = [
      where('week', '==', week),
      where('season', '==', season),
    ];

    const q = query(cg, ...constraints);
    return collectionData(q) as Observable<IParlayGameRow[]>;
  }

  fromTeamDate(
    team: string | IParlayTeam,
    date: number | Date,
    season: number = 2022
  ): Observable<IParlayGameRow[]> {
    const week = getWeekFromAmbig(date);
    const homeTeamID = this.teamdb.fromAmbig(team).teamID;

    const cg = collectionGroup(this.firestore, this.gameCollection.id);
    const constraints = [
      where('homeTeamID', '==', homeTeamID),
      where('week', '==', week),
      where('season', '==', season),
    ];

    const q = query(cg, ...constraints);
    return collectionData(q) as Observable<IParlayGameRow[]>;
  }

  fromParlayGame(game: IParlayGame): Observable<IParlayGameRow[]> {
    const cg = collectionGroup(this.firestore, this.gameCollection.id);
    const constraints = [
      where('homeTeamID', '==', game.home.teamID),
      where('week', '==', game.week),
      where('season', '==', game.season),
    ];

    const q = query(cg, ...constraints);
    return collectionData(q) as Observable<IParlayGameRow[]>;
  }

  updateGame(game: IParlayGame): Promise<void> {
    if (!game.gameID) {
      throw new Error(`Attempting to update a game with no ID W${game.week} ${game.away.abbr} @ ${game.home.abbr}`);
    }

    const pickDocumentReference = doc(
      this.firestore,
      `games/${game.gameID}`
    );
    return updateDoc(pickDocumentReference, { ...game.toParlayGameRow() });
  }

  addGame(game: IParlayGame) {
    if (game.gameID === "") {
      const docID = doc(this.gameCollection);
      game.gameID = docID.id;
    }
    return addDoc(this.gameCollection, game.toParlayGameRow());
  }

  delete(id: string) {
    const pickDocumentReference = doc(this.firestore, `games/${id}`);
    return deleteDoc(pickDocumentReference);
  }
}
