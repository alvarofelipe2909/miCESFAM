import { NgModule, Component } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ReservasAdministrativoComponent } from './reservas/reservas-administrativo/reservas-administrativo.component';
import { ReservasPacienteComponent } from './reservas/reservas-paciente/reservas-paciente.component';
import { ReservasMedicoComponent } from './reservas/reservas-medico/reservas-medico.component';
import { CrudReservasComponent } from './reservas/crud-reservas/crud-reservas.component';
import { AgregarDisponibilidadComponent } from './reservas/agregar-disponibilidad/agregar-disponibilidad.component';
import { CrudRemediosComponent } from './roles/farmaceutico/crud-remedios/crud-remedios.component';
import { VisualizarMedicamentosPacienteComponent } from './roles/paciente/visualizar-medicamentos-paciente/visualizar-medicamentos-paciente.component';
import { MedicoRecetasComponent } from './roles/medico/medico-recetas/medico-recetas.component';
import { PacienteRecetasComponent } from './roles/paciente/paciente-recetas/paciente-recetas.component';
import { MuestraPedidosComponent } from './roles/farmaceutico/muestra-pedidos/muestra-pedidos.component';
import { MedicoExamenesComponent } from './roles/medico/medico-examenes/medico-examenes.component';
import { PacienteExamenesComponent } from './roles/paciente/paciente-examenes/paciente-examenes.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { IndexComponent } from './index/index.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { PerfilComponent } from '././pages/perfil/perfil.component';
import { VerDisponibilidadComponent } from './reservas/ver-disponibilidad/ver-disponibilidad.component';
import { EnviarMensajeComponent } from './roles/administrativo/enviar-mensaje/enviar-mensaje.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginPageModule) },
  { path: 'registro', loadChildren: () => import('./auth/registro/registro.module').then(m => m.RegistroPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'paciente', loadChildren: () => import('./roles/paciente/paciente.module').then(m => m.PacientePageModule), canActivate: [AuthGuard], data: { role: 'paciente' } },
  { path: 'medico', loadChildren: () => import('./roles/medico/medico.module').then(m => m.MedicoPageModule), canActivate: [AuthGuard], data: { role: 'medico' } },
  { path: 'farmaceutico', loadChildren: () => import('./roles/farmaceutico/farmaceutico.module').then(m => m.FarmaceuticoPageModule), canActivate: [AuthGuard], data: { role: 'farmaceutico' } },
  { path: 'administrativo', loadChildren: () => import('./roles/administrativo/administrativo.module').then(m => m.AdministrativoPageModule), canActivate: [AuthGuard], data: { role: 'administrativo' } },
  { path: 'reservas-paciente', component: ReservasPacienteComponent, canActivate: [AuthGuard], data: { role: 'paciente' } },
  { path: 'reservas-medico', component: ReservasMedicoComponent, canActivate: [AuthGuard], data: { role: 'medico' } },
  { path: 'reservas-administrativo', component: ReservasAdministrativoComponent, canActivate: [AuthGuard], data: { role: 'administrativo' } },
  { path: 'reservas', component: CrudReservasComponent, canActivate: [AuthGuard], data: { roles: ['administrativo', 'paciente'] } },
  { path: 'disponibilidad', component: AgregarDisponibilidadComponent, canActivate: [AuthGuard], data: { role: ['medico'] } },
  { path: 'medicamentos',component: CrudRemediosComponent, canActivate: [AuthGuard], data: { role: ['farmaceutico'] } },
  { path: 'lista-medicamentos', component: VisualizarMedicamentosPacienteComponent, canActivate: [AuthGuard], data: { role: ['paciente'] } },
  { path: 'receta-medico', component: MedicoRecetasComponent , canActivate: [AuthGuard], data: { role: ['medico'] } },
  { path: 'receta-paciente', component: PacienteRecetasComponent , canActivate: [AuthGuard], data: { role: ['paciente'] } },
  { path: 'muestra-pedidos', component: MuestraPedidosComponent , canActivate: [AuthGuard], data: { role: ['farmaceutico'] } },
  { path: 'examen-medico' , component: MedicoExamenesComponent , canActivate: [AuthGuard], data: { role: ['medico'] } },
  { path: 'examen-paciente', component: PacienteExamenesComponent , canActivate: [AuthGuard], data: { role: ['paciente'] } },
  { path: 'password-reset', component: PasswordResetComponent},
  { path: 'inicio', component: IndexComponent},
  { path: 'contacto', component: ContactoComponent},
  { path: 'sobre-nosotros', component: SobreNosotrosComponent},
  { path: 'perfil',  component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'ver-disponibilidad', component: VerDisponibilidadComponent, canActivate: [AuthGuard], data: { role: ['medico'] } },
  { path: 'enviar-mensaje', component: EnviarMensajeComponent, canActivate: [AuthGuard], data: { role: ['administrativo'] } }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }