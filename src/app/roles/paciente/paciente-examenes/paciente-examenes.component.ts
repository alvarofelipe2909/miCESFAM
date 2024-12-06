import { Component, OnInit } from '@angular/core';
import { MedicoExamenesService } from 'src/app/services/medico-examenes.service';
import { AuthService } from 'src/app/services/auth.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-paciente-examenes',
  templateUrl: './paciente-examenes.component.html',
  styleUrls: ['./paciente-examenes.component.scss'],
})
export class PacienteExamenesComponent implements OnInit {
  examenes: any[] = [];
  pacienteId: string | null = null;
  loading: boolean = true;
  searchTerm: string = '';

  constructor(
    private medicoExamenesService: MedicoExamenesService,
    private authService: AuthService,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.pacienteId = user.uid;
        this.cargarExamenes();
      }
    });
  }

  cargarExamenes() {
    if (this.pacienteId) {
      this.loading = true;
      this.medicoExamenesService.getExamenes(this.pacienteId).subscribe(data => {
        this.examenes = data;
        this.loading = false;
      });
    }
  }

  descargarExamen(url: string, nombreArchivo: string) {
    
    const element = document.getElementById(`download-${nombreArchivo}`);
    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(300)
        .iterations(1)
        .fromTo('transform', 'scale(1)', 'scale(0.95)')
        .fromTo('opacity', '1', '0.7');
      
      animation.play().then(() => {
        window.open(url, '_blank');
      });
    } else {
      window.open(url, '_blank');
    }
  }

  filtrarExamenes() {
    return this.examenes.filter(examen =>
      examen.nombreArchivo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      examen.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}