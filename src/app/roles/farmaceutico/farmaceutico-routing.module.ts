import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FarmaceuticoPage } from './farmaceutico.page';

const routes: Routes = [
  {
    path: '',
    component: FarmaceuticoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FarmaceuticoPageRoutingModule {}
