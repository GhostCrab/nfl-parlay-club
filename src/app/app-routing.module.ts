import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';

import { NgModule } from '@angular/core';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['dashboard']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/auth/auth.module').then((m) => m.AuthModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'picks',
    loadChildren: () =>
      import('./features/picks/picks.module').then((m) => m.PicksModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'games',
    loadChildren: () =>
      import('./features/games/games.module').then((m) => m.GamesModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'teams',
    loadChildren: () =>
      import('./features/teams/teams.module').then((m) => m.TeamsModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
