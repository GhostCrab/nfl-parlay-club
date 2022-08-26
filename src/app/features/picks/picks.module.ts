import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { PicksRoutingModule } from './picks-routing.module';
import { PicksComponent } from './picks.component';
import { ListComponent } from './components/list/list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DetailComponent } from './components/detail/detail.component';

@NgModule({
  declarations: [PicksComponent, ListComponent, DetailComponent],
  imports: [
    CommonModule,
    PicksRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class PicksModule {}
