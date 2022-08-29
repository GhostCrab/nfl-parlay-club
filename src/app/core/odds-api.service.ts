import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { NFLData } from './interfaces/nfl-api.interface';
import { ParlayGame } from '../features/games/interfaces/parlay-game.interface';
import { TeamDatabaseService } from './team-database.service';

@Injectable({
  providedIn: 'root',
})
export class OddsApiService {
  private apiUrl =
    'https://www.sportsline.com/sportsline-web/service/v1/odds';
  private apiSearchParams = {
    league: 'nfl',
    callback: 'foo'
  };

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private readonly teamdb: TeamDatabaseService
  ) {}

  getData(): Observable<any> {
    const url = new URL(this.apiUrl);
    for (const [key, value] of Object.entries(this.apiSearchParams)) {
      url.searchParams.set(key, value);
    }

    console.log(`Querying ${url.href}`);

    return this.http.get<any>(url.href);
  }
}
