import { Component, OnInit } from '@angular/core';
import { ReservaService } from 'src/app/services/reservas.service';
@Component({
  selector: 'app-reservas-administrativo',
  templateUrl: './reservas-administrativo.component.html',
  styleUrls: ['./reservas-administrativo.component.scss'],
})
export class ReservasAdministrativoComponent implements OnInit  {

  reservas: any[] = [];

  constructor(private reservaService: ReservaService) {}

  ngOnInit() {
    this.obtenerTodasReservas();
  }

  obtenerTodasReservas() {
    this.reservaService.obtenerTodasReservas().subscribe(reservas => {
      this.reservas = reservas;
    });
  }

  editarReserva(id: string, nuevaData: any) {
    this.reservaService.actualizarReserva(id, nuevaData);
  }

  eliminarReserva(id: string) {
    this.reservaService.eliminarReserva(id).then(() => {
      this.obtenerTodasReservas();  // Actualizar después de eliminar
    });
  }



}
