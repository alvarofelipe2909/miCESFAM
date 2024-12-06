import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MedicoPageRoutingModule } from './medico-routing.module';

import { MedicoPage } from './medico.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: MedicoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MedicoPageRoutingModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [MedicoPage]
})
export class MedicoPageModule {}
