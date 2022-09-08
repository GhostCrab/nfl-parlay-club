import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { NFLData } from '../interfaces/nfl-api.interface';
import { IParlayGame, ParlayGame } from '../../features/games/interfaces/parlay-game.interface';
import { TeamDatabaseService } from './team-database.service';
import { GameDatabaseService } from './game-database.service';

@Injectable({
  providedIn: 'root',
})
export class NFLApiService {
  private apiUrl =
    'https://metabet.static.api.areyouwatchingthis.com/api/odds.json';
  private apiSearchParams = {
    apiKey: '219f64094f67ed781035f5f7a08840fc',
    leagueCode: 'FBP',
  };

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private readonly teamdb: TeamDatabaseService,
    private readonly gamedb: GameDatabaseService
  ) {}

  getData(week: string): Observable<NFLData> {
    const url = new URL(this.apiUrl);
    for (const [key, value] of Object.entries(this.apiSearchParams)) {
      url.searchParams.set(key, value);
    }

    url.searchParams.set('round', week);

    return this.http.get<NFLData>(url.href);
  }

  getUpdatedGames(week: number, includeOdds = false): Observable<[IParlayGame[], IParlayGame[]]> {
    const url = new URL(this.apiUrl);
    for (const [key, value] of Object.entries(this.apiSearchParams)) {
      url.searchParams.set(key, value);
    }

    url.searchParams.set('round', `Week ${week}`);

    return this.http.get<NFLData>(url.href).pipe(
      map((data) => {
        const newGames: IParlayGame[] = [];
        const updatedGames: IParlayGame[] = [];
        for (const result of data.results) {
          try {
            const dbGame = this.gamedb.fromTeamDate(
              result.team2Name,
              result.date
            );
            dbGame.updateFromAPI(result);
            includeOdds && dbGame.safeToUpdateOdds() && dbGame.updateOddsFromAPI(result);
            updatedGames.push(dbGame);
          } catch (e) {
            const newGame = new ParlayGame(
              result.team2Name,
              result.team1Name,
              result.date,
              this.teamdb
            );
            newGame.updateFromAPI(result);
            newGame.updateOddsFromAPI(result);
            console.log(`Adding new game: ${newGame.toString()}`);
            newGames.push(newGame);
          }
        }
        return [newGames, updatedGames];
      })
    );
  }

  async updateGames(week: number, includeOdds = false): Promise<IParlayGame[]> {
    return new Promise ((resolve, reject) => {
      this.getUpdatedGames(week, includeOdds).subscribe(async (data) => {
        const [newGames, updatedGames] = data;
        await this.gamedb.batchWrite(newGames, updatedGames);
        resolve([...newGames, ...updatedGames])
      })
   });
  }

  // getGames(week: string): Observable<ParlayGame[]> {
  //   const url = new URL(this.apiUrl);
  //   for (const [key, value] of Object.entries(this.apiSearchParams)) {
  //     url.searchParams.set(key, value);
  //   }

  //   url.searchParams.set('round', week);

  //   return this.http.get<NFLData>(url.href).pipe(map(data => {
  //     let games: ParlayGame[] = [];
  //     for (const result of data.results) {
  //       games.push({
  //         gameID: result.gameID,
  //         homeTeamID: result.team1ID,
  //         awayTeamID: result.team2ID,
  //         favoredTeamID: result.team1ID,
  //         spread: result.odds[0].spread,
  //         ou: result.odds[0].overUnder,
  //         gameDate: result.date,
  //       })
  //     }
  //     return games;
  //   }));
  // }
}
