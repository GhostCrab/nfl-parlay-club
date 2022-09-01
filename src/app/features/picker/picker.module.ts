import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PickerRoutingModule } from './picker-routing.module';
import { PickerComponent } from './picker.component';
import { ListComponent } from '../picker/components/list/list.component';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [PickerComponent, ListComponent],
  imports: [
    CommonModule,
    PickerRoutingModule,
    MatCheckboxModule,
    MatGridListModule,
    MatButtonModule,
  ],
})
export class PickerModule {}
