import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FarmaceuticoPageRoutingModule } from './farmaceutico-routing.module';

import { FarmaceuticoPage } from './farmaceutico.page';

const routes: Routes = [
  {
    path: '',
    component: FarmaceuticoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FarmaceuticoPageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FarmaceuticoPage]
})
export class FarmaceuticoPageModule {}
