import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [{ path: '', component: DashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), MatButtonModule],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
