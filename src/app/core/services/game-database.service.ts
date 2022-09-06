import { Injectable, Query } from '@angular/core';
import {
  Observable,
  from,
  map,
  BehaviorSubject,
  AsyncSubject,
  ReplaySubject,
  firstValueFrom,
} from 'rxjs';

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
  setDoc,
} from '@angular/fire/firestore';
import {
  IParlayGame,
  ParlayGame,
} from '../../features/games/interfaces/parlay-game.interface';
import { IParlayGameRow } from '../interfaces/parlay-game-row.interface';
import { TeamDatabaseService } from './team-database.service';
import { NFLApiService } from './nfl-api.service';

function gameRowUID(game: IParlayGameRow) {
  function pad(num: number) {
    let numstr = num.toString();
    while (numstr.length < 2) numstr = '0' + numstr;
    return numstr;
  }

  return `${pad(game.week)}${pad(game.homeTeamID)}`;
}

@Injectable({
  providedIn: 'root',
})
export class GameDatabaseService {
  private gameCollection: CollectionReference<DocumentData>;
  private allGames: Map<string, IParlayGameRow>;
  private allGames$: ReplaySubject<IParlayGameRow[]>;

  private initialized: boolean;

  constructor(
    private readonly firestore: Firestore,
    private readonly teamdb: TeamDatabaseService,
    private readonly nflapi: NFLApiService
  ) {
    console.log(`constructor: Querying DB`);
    try {
      this.gameCollection = collection(firestore, 'games');
    } catch (e) {
      console.log(firestore);
      console.error(e);
    }

    this.initialized = false;
    this.allGames = new Map<string, IParlayGameRow>();
    this.initializeService();
  }

  initializeService() {
    if (!this.allGames$) {
      this.allGames$ = new ReplaySubject(1);

      console.log(`initializeService: Querying DB`);
      const cd = collectionData(this.gameCollection, {
        idField: 'gameID',
      }) as Observable<IParlayGameRow[]>;

      cd.subscribe((data) => {
        console.log(`initializeService: Subscription Update`);
        this.allGames$.next(data);
        this.allGames.clear();
        for (const gameRow of data) {
          this.allGames.set(gameRowUID(gameRow), gameRow);
        }
        this.initialized = true;
      });
    }
  }

  getAll(): Observable<IParlayGame[]> {
    console.log(`getAll: Retrieving dbdata`);
    return this.allGames$.pipe(
      map((rows: IParlayGameRow[]) => {
        const result: IParlayGame[] = [];
        for (const row of rows) {
          result.push(new ParlayGame(row, this.teamdb));
        }
        return result;
      }),
      map((data) => {
        data.sort(ParlayGame.sort);
        return data;
      })
    );
  }

  fromWeek(week: number) {
    return this.getAll().pipe(
      map((data) => {
        return data.filter((a) => a.week === week);
      })
    );
  }

  async waitForInit(timeout = 1000) {
    // wait until the internal dataset has been initialized before updating
    while (!this.initialized) await new Promise((r) => setTimeout(r, 1000));
  }

  async updateWeek(week: number): Promise<void> {
    await this.waitForInit();

    const apigames = await firstValueFrom(this.nflapi.getGames(week, true));

    for (const apigame of apigames) {
      // find game in dbgames
      const dbgame = this.allGames.get(apigame.gameID);

      if (dbgame) {
        const dbParlayGame = new ParlayGame(dbgame, this.teamdb);
        dbParlayGame.updateAll(apigame);
        await dbParlayGame.writeToDb(this);
      } else {
        await apigame.addToDb(this);
      }
    }
  }

  updateGame(game: IParlayGame): Promise<void> {
    console.log(`updateGame: Querying DB`);
    if (!game.gameID) {
      throw new Error(
        `Attempting to update a game with no ID W${game.week} ${game.away.abbr} @ ${game.home.abbr}`
      );
    }

    const pickDocumentReference = doc(this.firestore, `games/${game.gameID}`);
    return updateDoc(pickDocumentReference, { ...game.toParlayGameRow() });
  }

  addGame(game: IParlayGame) {
    console.log(`addGame: Querying DB`);

    const gameDocumentReference = doc(this.gameCollection, game.gameID);
    return setDoc(gameDocumentReference, game.toParlayGameRow());
    //return addDoc(this.gameCollection, game.toParlayGameRow());
  }

  fromID(gameID: string) {
    this.initCheck();

    const game = this.allGames.get(gameID);

    if (!game) throw new Error(`Unable to find game with ID ${gameID}`);

    return new ParlayGame(game, this.teamdb);
  }

  initCheck() {
    if (!this.initialized)
      throw new Error(
        `Unable to query for game by ID - Game Service Not Initialized`
      );
  }

  delete(id: string) {
    console.log(`delete: Querying DB`);
    const gameDocumentReference = doc(this.firestore, `games/${id}`);
    return deleteDoc(gameDocumentReference);
  }
}
