import { Timestamp } from "@angular/fire/firestore";

export interface IParlayGameRow {
    gameID: string;
    homeTeamID: number;
    awayTeamID: number;
    gt: Timestamp;
    week: number;
    season: number;
    favTeamID: number;
    spread: number;
    ou: number;
    complete: boolean;
    homeScore: number;
    awayScore: number;
}