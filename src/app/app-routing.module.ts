import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ReservasAdministrativoComponent } from './reservas/reservas-administrativo/reservas-administrativo.component';
import { ReservasPacienteComponent } from './reservas/reservas-paciente/reservas-paciente.component';
import { ReservasMedicoComponent } from './reservas/reservas-medico/reservas-medico.component';
import { CrudReservasComponent } from './reservas/crud-reservas/crud-reservas.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'paciente', loadChildren: () => import('./roles/paciente/paciente.module').then(m => m.PacientePageModule), canActivate: [AuthGuard], data: { role: 'paciente' } },
  { path: 'medico', loadChildren: () => import('./roles/medico/medico.module').then(m => m.MedicoPageModule), canActivate: [AuthGuard], data: { role: 'medico' } },
  { path: 'farmaceutico', loadChildren: () => import('./roles/farmaceutico/farmaceutico.module').then(m => m.FarmaceuticoPageModule), canActivate: [AuthGuard], data: { role: 'farmaceutico' } },
  { path: 'administrativo', loadChildren: () => import('./roles/administrativo/administrativo.module').then(m => m.AdministrativoPageModule), canActivate: [AuthGuard], data: { role: 'administrativo' } },
  { path: 'reservas-paciente', component: ReservasPacienteComponent, canActivate: [AuthGuard], data: { role: 'paciente' } },
  { path: 'reservas-medico', component: ReservasMedicoComponent, canActivate: [AuthGuard], data: { role: 'medico' } },
  { path: 'reservas-administrativo', component: ReservasAdministrativoComponent, canActivate: [AuthGuard], data: { role: 'administrativo' } },
  { path: 'reservas', component: CrudReservasComponent, canActivate: [AuthGuard], data: { roles: ['administrativo', 'paciente'] } },
    
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }