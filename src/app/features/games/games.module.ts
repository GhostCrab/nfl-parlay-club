import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { ListComponent } from './components/list/list.component';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [GamesComponent, ListComponent],
  imports: [CommonModule, GamesRoutingModule, MatGridListModule],
})
export class GamesModule {}
