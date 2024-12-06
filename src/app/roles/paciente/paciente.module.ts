import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { Routes,RouterModule } from '@angular/router';
import { PacientePageRoutingModule } from './paciente-routing.module';

import { PacientePage } from './paciente.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path:'',
    component:PacientePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    IonicModule,
    PacientePageRoutingModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PacientePage]
})
export class PacientePageModule {}
