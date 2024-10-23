import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReservaService } from './services/reservas.service';
import { AuthService } from './services/auth.service';
import { ReservasPacienteComponent } from './reservas/reservas-paciente/reservas-paciente.component';
import { ReservasMedicoComponent } from './reservas/reservas-medico/reservas-medico.component';
import { ReservasAdministrativoComponent } from './reservas/reservas-administrativo/reservas-administrativo.component';
import { CrudReservasComponent } from './reservas/crud-reservas/crud-reservas.component';

@NgModule({
  declarations: [AppComponent, ReservasPacienteComponent,
                  ReservasMedicoComponent,
                  ReservasAdministrativoComponent,
                  CrudReservasComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    ReservaService,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
