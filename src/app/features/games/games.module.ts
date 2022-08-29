import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesRoutingModule } from './games-routing.module';
import { GamesComponent } from './games.component';
import { ListComponent } from './components/list/list.component';

import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatGridListModule } from '@angular/material/grid-list'

@NgModule({
  declarations: [GamesComponent, ListComponent],
  imports: [CommonModule, GamesRoutingModule, MatCheckboxModule, MatGridListModule],
})
export class GamesModule {}
