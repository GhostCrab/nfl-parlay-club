import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GamesListComponent } from './games-list/games-list.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { PicksListComponent } from './picks-list/picks-list.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    DashboardComponent,
    GamesListComponent,
    PicksListComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatGridListModule,
    MatButtonModule
  ]
})
export class DashboardModule { }
