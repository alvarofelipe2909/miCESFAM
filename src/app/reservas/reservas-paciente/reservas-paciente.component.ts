import { Component, OnInit } from '@angular/core';
import { ReservaService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reservas-paciente',
  templateUrl: './reservas-paciente.component.html',
  styleUrls: ['./reservas-paciente.component.scss'],
})
export class ReservasPacienteComponent implements OnInit {
  reservas: any[] = [];
  reservasFiltradas: any[] = [];
  userRut: string = '';
  filtroEstado: string = 'Todas';
  filtroAnio: string = ''; // Filtro por año
  filtroMes: string = ''; // Filtro por mes

  aniosDisponibles: string[] = []; // Años dinámicos
  mesesDisponibles = [
    { label: 'Enero', value: '01' },
    { label: 'Febrero', value: '02' },
    { label: 'Marzo', value: '03' },
    { label: 'Abril', value: '04' },
    { label: 'Mayo', value: '05' },
    { label: 'Junio', value: '06' },
    { label: 'Julio', value: '07' },
    { label: 'Agosto', value: '08' },
    { label: 'Septiembre', value: '09' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' },
  ];

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userRut = user.rut;
        this.obtenerReservas();
        this.initAniosDisponibles();
      }
    });
  }

  obtenerReservas() {
    this.reservaService.obtenerReservasPorPaciente(this.userRut).subscribe((reservas: any[]) => {
      this.reservas = reservas;
      this.filtrarReservas();
    });
  }

  filtrarReservas() {
    this.reservasFiltradas = this.reservas.filter(reserva => {
      let coincideEstado = this.filtroEstado === 'Todas' || reserva.estado === this.filtroEstado;
      let coincideFecha =
        (!this.filtroAnio || reserva.fecha.startsWith(this.filtroAnio)) &&
        (!this.filtroMes || reserva.fecha.substring(5, 7) === this.filtroMes);

      return coincideEstado && coincideFecha;
    });
  }

  setFiltroEstado(estado: string) {
    this.filtroEstado = estado;
    this.filtrarReservas();
  }

  initAniosDisponibles() {
    const currentYear = new Date().getFullYear();
    const initialYear = 2024;
    this.aniosDisponibles = [];
  
    for (let year = currentYear; year >= initialYear; year--) {
      this.aniosDisponibles.push(year.toString());
    }
  }

  async eliminarReserva(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar cancelación',
      message: '¿Está seguro de que desea cancelar esta reserva?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.reservaService.eliminarReserva(id).then(() => {
              this.obtenerReservas();
            });
          },
        },
      ],
    });

    await alert.present();
  }
}
