import { Component, OnInit, Inject } from '@angular/core';
import { ReservaService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reservas-paciente',
  templateUrl: './reservas-paciente.component.html',
  styleUrls: ['./reservas-paciente.component.scss'],
})
export class ReservasPacienteComponent implements OnInit {
  reservas: any[] = [];
  userId: string = '';

  constructor(@Inject(ReservaService) private reservaService: ReservaService, @Inject(AuthService) private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserUid().then((uid) => {
      if (uid !== null) {
        this.userId = uid;
      }
      this.obtenerReservas();
    });
  }

  obtenerReservas() {
    this.reservaService.obtenerReservasPorPaciente(this.userId).subscribe((reservas: any[]) => {
      this.reservas = reservas;
    });
  }
  editarReserva(id: string, nuevaData: any) {
    this.reservaService.actualizarReserva(id, nuevaData).then(() => {
      this.obtenerReservas();  // Actualizar después de editar
    });
  }

  cancelarReserva(id: string) {
    this.reservaService.eliminarReserva(id).then(() => {
      this.obtenerReservas();  // Actualizar después de eliminar
    });
  }
}
