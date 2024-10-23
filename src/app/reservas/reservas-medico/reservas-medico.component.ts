import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/services/reservas.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reservas-medico',
  templateUrl: './reservas-medico.component.html',
  styleUrls: ['./reservas-medico.component.scss'],
})
export class ReservasMedicoComponent implements OnInit  {

  reservas: any[] = [];
  userId: string = '';

  constructor(private reservaService: ReservaService, private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserUid().then(uid => {
      this.userId = uid!;
      this.obtenerReservas();
    });
  }

  obtenerReservas() {
    this.reservaService.obtenerReservasPorMedico(this.userId).subscribe(reservas => {
      this.reservas = reservas;
    });
  }

  confirmarReserva(id: string) {
    this.reservaService.actualizarReserva(id, { estado: 'Confirmada' });
  }

  completarReserva(id: string) {
    this.reservaService.actualizarReserva(id, { estado: 'Completada' });
  }

}
