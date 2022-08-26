import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: '', loadChildren: () => import('./features/picks/picks.module').then(m => m.PicksModule) }, { path: 'games', loadChildren: () => import('./features/games/games.module').then(m => m.GamesModule) }, { path: 'teams', loadChildren: () => import('./features/teams/teams.module').then(m => m.TeamsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
