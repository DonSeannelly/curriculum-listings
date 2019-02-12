import { NgModule } from '@angular/core';

import { CollectionComponent } from './collection.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CubeSharedModule } from '../shared/cube-shared.module';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CubeSharedModule,
    SharedModule,
    RouterModule
  ],
  exports: [],
  declarations: [CollectionComponent]
})
export class CollectionModule {}
