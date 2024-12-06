import { Component, OnInit } from '@angular/core';
import { MedicoExamenesService } from 'src/app/services/medico-examenes.service';
import { EmailService } from 'src/app/services/email.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-medico-examenes',
  templateUrl: './medico-examenes.component.html',
  styleUrls: ['./medico-examenes.component.scss'],
})
export class MedicoExamenesComponent implements OnInit {
  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  pacienteSeleccionado: any = null;
  archivo: File | null = null;
  busqueda: string = '';
  descripcion: string = '';
  examenes: any[] = [];
  medico: any = null;
  cargandoArchivo: boolean = false;
  nombreArchivo: string = '';

  constructor(
    private medicoExamenesService: MedicoExamenesService,
    private emailService: EmailService,
    private authService: AuthService,
    private toastController: ToastController,
    private animationCtrl: AnimationController
  ) { }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      this.medico = user;
    });

    this.medicoExamenesService.getPacientes().subscribe(data => {
      this.pacientes = data;
    });
  }

  onBusquedaChange(event: any) {
    const query = event.target.value.toLowerCase();
    if (query) {
      this.pacientesFiltrados = this.pacientes.filter(paciente =>
        paciente.rut.toLowerCase().includes(query) ||
        `${paciente.nombre.toLowerCase()} ${paciente.apellido.toLowerCase()}`.includes(query)
      );
    } else {
      this.pacientesFiltrados = [];
    }
  }

  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.busqueda = `${paciente.rut} - ${paciente.nombre} ${paciente.apellido}`;
    this.pacientesFiltrados = [];
    this.cargarExamenes();

    // Animación de selección
    const element = document.querySelector('.selected-patient-card');
    if (element) {
      const animation = this.animationCtrl.create()
        .addElement(element)
        .duration(300)
        .fromTo('opacity', '0', '1')
        .fromTo('transform', 'translateY(20px)', 'translateY(0)');
      
      animation.play();
    }
  }

  async onFileChange(event: any) {
    this.archivo = event.target.files[0];
    this.nombreArchivo = this.archivo?.name || '';
    
    if (this.archivo && !['application/pdf', 'image/jpeg', 'image/png'].includes(this.archivo.type)) {
      const toast = await this.toastController.create({
        message: 'Por favor seleccione un archivo PDF o imagen (JPG, PNG)',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      this.archivo = null;
      this.nombreArchivo = '';
    }
  }

  async subirExamen() {
    if (!this.pacienteSeleccionado || !this.archivo) {
      const toast = await this.toastController.create({
        message: 'Seleccione un paciente y un archivo',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      return;
    }

    this.cargandoArchivo = true;

    try {
      await lastValueFrom(this.medicoExamenesService.subirExamen(
        this.pacienteSeleccionado.id,
        this.archivo,
        this.descripcion
      ));

      if (this.medico) {
        const nombreMedico = `${this.medico.nombre} ${this.medico.apellido}`;
        await this.emailService.sendEmailExamen(
                  this.pacienteSeleccionado.nombre,
                  nombreMedico,
                  this.descripcion,
                  this.pacienteSeleccionado.email
                );
      }

      const toast = await this.toastController.create({
        message: 'Examen subido exitosamente',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      toast.present();

      this.archivo = null;
      this.descripcion = '';
      this.nombreArchivo = '';
      this.cargarExamenes();

    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al subir el examen',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }

    this.cargandoArchivo = false;
  }

  async eliminarExamen(examen: any) {
    try {
      await this.medicoExamenesService.eliminarExamen(
        examen.id, 
        `examenes/${examen.pacienteId}/${examen.nombreArchivo}`
      );
      
      const toast = await this.toastController.create({
        message: 'Examen eliminado exitosamente',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      toast.present();
      
      this.cargarExamenes();
    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al eliminar el examen',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }
  }

  cargarExamenes() {
    if (this.pacienteSeleccionado) {
      this.medicoExamenesService.getExamenes(this.pacienteSeleccionado.id).subscribe(data => {
        this.examenes = data;
      });
    }
  }
}