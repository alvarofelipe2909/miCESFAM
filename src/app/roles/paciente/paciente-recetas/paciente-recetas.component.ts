import { Component, OnInit } from '@angular/core';
import { RecetaService } from 'src/app/services/receta.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-paciente-recetas',
  templateUrl: './paciente-recetas.component.html',
  styleUrls: ['./paciente-recetas.component.scss'],
})
export class PacienteRecetasComponent implements OnInit {
  recetas: any[] = [];
  rutPaciente: string | undefined;

  constructor(private recetaService: RecetaService, private authService: AuthService) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.getUserRut(user.uid).subscribe(rut => {
          this.rutPaciente = rut;
          this.recetaService.getRecetasByRut(this.rutPaciente).subscribe(data => {
            this.recetas = data;
          });
        });
      }
    });
  }

  downloadPDF(url: string) {
    window.open(url, '_blank');
  }
}