import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PicksComponent } from './picks.component';

const routes: Routes = [{ path: '', component: PicksComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PicksRoutingModule { }
