import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';
import { EmailService} from 'src/app/services/email.service';


@Component({
  selector: 'app-reservas-medico',
  templateUrl: './reservas-medico.component.html',
  styleUrls: ['./reservas-medico.component.scss'],
})
export class ReservasMedicoComponent implements OnInit {
  reservas: any[] = [];
  medicoId: string = '';
  filtroEstado: string = 'todos';
  currentUser: any;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService,
    private alertController: AlertController,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.medicoId = user.uid;
        this.obtenerReservas();
      }
    });
  }

  obtenerReservas() {
    this.reservaService.obtenerReservasPorMedico(this.medicoId).subscribe((reservas: any[]) => {
      this.reservas = reservas;
      console.log('Reservas obtenidas:', this.reservas);
    });
  }

  filtrarReservas(estado: string) {
    this.filtroEstado = estado;
  }

  getReservasFiltradas() {
    if (this.filtroEstado === 'todos') {
      return this.reservas;
    }
    return this.reservas.filter(reserva => reserva.estado === this.filtroEstado);
  }

  confirmarReserva(id: string) {
    this.reservaService.actualizarEstadoReserva(id, 'Confirmada').then(() => {
      this.obtenerReservas();
      this.enviarEmailEstado(id, 'Confirmada');
    });
  }

  completarReserva(id: string) {
    this.reservaService.actualizarEstadoReserva(id, 'Completada').then(() => {
      this.obtenerReservas();
      this.enviarEmailEstado(id, 'Completada');
    });
  }

  async rechazarReserva(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar Rechazo',
      message: '¿Está seguro de que desea rechazar esta reserva?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Rechazar',
          handler: () => {
            this.reservaService.actualizarEstadoReserva(id, 'Rechazada').then(() => {
              this.obtenerReservas();
              this.enviarEmailEstado(id, 'Rechazada');
            });
          },
        },
      ],
    });

    await alert.present();
  }
  enviarEmailEstado(id: string, estado: string) {
    this.reservaService.obtenerReserva(id).subscribe(reserva => {
      if (reserva && reserva.emailPaciente) {
        this.emailService.sendEmailEstado(
          reserva.nombreCompletoPaciente,
          reserva.nombreCompletoMedico,
          reserva.fecha,
          reserva.hora,
          estado,
          reserva.emailPaciente
        );
      } else {
        console.error('El campo emailPaciente está vacío o no existe.');
      }
    });
  }

  getEstadoColor(estado: 'Pendiente' | 'Confirmada' | 'Completada' | 'Rechazada'): string {
    const colores = {
      'Pendiente': 'estado-pendiente',
      'Confirmada': 'estado-confirmada',
      'Completada': 'estado-completada',
      'Rechazada': 'estado-rechazada'
    };
    return colores[estado] || '';
  }
}