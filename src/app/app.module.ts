import { CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from './services/reservas.service';
import { AuthService } from './services/auth.service';
import { ReservasPacienteComponent } from './reservas/reservas-paciente/reservas-paciente.component';
import { ReservasMedicoComponent } from './reservas/reservas-medico/reservas-medico.component';
import { ReservasAdministrativoComponent } from './reservas/reservas-administrativo/reservas-administrativo.component';
import { CrudReservasComponent } from './reservas/crud-reservas/crud-reservas.component';
import { AgregarDisponibilidadComponent } from './reservas/agregar-disponibilidad/agregar-disponibilidad.component';
import { CrudRemediosComponent } from './roles/farmaceutico/crud-remedios/crud-remedios.component';
import { VisualizarMedicamentosPacienteComponent } from './roles/paciente/visualizar-medicamentos-paciente/visualizar-medicamentos-paciente.component';
import { MenuComponent } from './menu/menu.component';
import { MedicoRecetasComponent } from './roles/medico/medico-recetas/medico-recetas.component';
import { PacienteRecetasComponent } from './roles/paciente/paciente-recetas/paciente-recetas.component';
import { MuestraPedidosComponent } from './roles/farmaceutico/muestra-pedidos/muestra-pedidos.component';
import { MedicoExamenesComponent } from './roles/medico/medico-examenes/medico-examenes.component';
import { PacienteExamenesComponent } from './roles/paciente/paciente-examenes/paciente-examenes.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { SobreNosotrosComponent } from './pages/sobre-nosotros/sobre-nosotros.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { VerDisponibilidadComponent } from './reservas/ver-disponibilidad/ver-disponibilidad.component';
import { EnviarMensajeComponent } from './roles/administrativo/enviar-mensaje/enviar-mensaje.component';
import { Env } from 'ionicons/dist/types/stencil-public-runtime';

@NgModule({
  declarations: [
    AppComponent,
    ReservasPacienteComponent,
    ReservasMedicoComponent,
    ReservasAdministrativoComponent,
    CrudReservasComponent,
    AgregarDisponibilidadComponent,
    CrudRemediosComponent,
    VisualizarMedicamentosPacienteComponent,
    MenuComponent,
    MedicoRecetasComponent,
    PacienteRecetasComponent,
    MuestraPedidosComponent,
    MedicoExamenesComponent,
    PacienteExamenesComponent,
    PasswordResetComponent,
    ContactoComponent,
    SobreNosotrosComponent,
    NotificationsComponent,
    PerfilComponent,
    VerDisponibilidadComponent,
    EnviarMensajeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    ReservaService,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
