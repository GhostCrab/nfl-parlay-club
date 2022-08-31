import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar'

import { NavBarComponent } from './nav-bar.component';
import { DashboardRoutingModule } from '../features/dashboard/dashboard-routing.module';

@NgModule({
  declarations: [
    NavBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    DashboardRoutingModule
  ],
  exports: [
    NavBarComponent
  ]
})
export class NavBarModule { }
