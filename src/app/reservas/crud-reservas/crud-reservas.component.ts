import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservaService } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EmailService } from 'src/app/services/email.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-crud-reservas',
  templateUrl: './crud-reservas.component.html',
  styleUrls: ['./crud-reservas.component.scss']
})
export class CrudReservasComponent implements OnInit {
  medicos: any[] = [];
  disponibilidad: any[] = [];
  horasDisponibles: string[] = [];
  especialidades: any[] = [];
  reservasForm!: FormGroup;
  horaSeleccionada: string = '';
  minDate: string;
  currentUser: any;


  constructor(
    private fb: FormBuilder,
    private reservasService: ReservaService,
    private authService: AuthService,
    private router: Router,
    private emailService: EmailService,
    private toastController: ToastController
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.initForm();
    this.loadUserData();
    this.loadEspecialidades();
  }

  private initForm() {
    this.reservasForm = this.fb.group({
      especialidad: ['', Validators.required],
      medicoId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required]
    });
  }

  private loadUserData() {
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  private loadEspecialidades() {
    this.reservasService.obtenerEspecialidades().subscribe(especialidades => {
      this.especialidades = especialidades;
    });
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  onEspecialidadChange(especialidad: string) {
    this.reservasService.obtenerMedicosPorEspecialidad(especialidad).subscribe(medicos => {
      this.medicos = medicos;
      this.limpiarDisponibilidad();
    });
  }

  onMedicoChange(medicoId: string) {
    this.reservasService.obtenerDisponibilidadPorMedico(medicoId).subscribe(disponibilidad => {
      this.disponibilidad = disponibilidad;
      if (this.reservasForm?.get('fecha')?.value) {
        this.onFechaChange(this.reservasForm.get('fecha')?.value);
      }
    });
  }

  onFechaChange(value: any) {
    const fechaSeleccionada = typeof value === 'string' ? value.split('T')[0] : '';
    const disponibilidadFecha = this.disponibilidad.find(disp => disp.fechas.includes(fechaSeleccionada));
    
    if (disponibilidadFecha) {
      this.reservasService.obtenerReservasPorFecha(fechaSeleccionada).subscribe(reservas => {
        const horasOcupadas = reservas.map(reserva => reserva.hora);
        this.horasDisponibles = disponibilidadFecha.horas.filter((hora: any) => !horasOcupadas.includes(hora));
      });
    } else {
      this.horasDisponibles = [];
    }
    this.reservasForm.get('fecha')?.setValue(fechaSeleccionada);
  }

  seleccionarHora(hora: string) {
    this.horaSeleccionada = hora;
    this.reservasForm.get('hora')?.setValue(hora);
  }

  limpiarDisponibilidad() {
    this.disponibilidad = [];
    this.horasDisponibles = [];
    this.horaSeleccionada = '';
  }

  reservarHora() {
    if (this.reservasForm.valid) {
      const reserva = this.reservasForm.value;
      const medico = this.medicos.find(m => m.id === reserva.medicoId);
      const reservaCompleta = {
        ...reserva,
        nombreCompletoPaciente: `${this.currentUser?.nombre || ''} ${this.currentUser?.apellido || ''}`,
        rutPaciente: this.currentUser?.rut || '',
        nombreCompletoMedico: `${medico.nombre} ${medico.apellido}`,
        emailPaciente: this.currentUser?.email || '',
        estado: 'Pendiente'
      };
  
      this.reservasService.crearReserva(reservaCompleta)
        .then(async () => {
          // Enviar correo electrónico al paciente
          this.emailService.sendEmailReserva(
            reservaCompleta.nombreCompletoPaciente,
            reservaCompleta.nombreCompletoMedico,
            reservaCompleta.fecha,
            reservaCompleta.hora,
            reservaCompleta.emailPaciente
          );
  
          const toast = await this.toastController.create({
            message: 'Reserva creada y correo enviado con éxito',
            duration: 3000,
            color: 'success'
          });
          toast.present();
  
          this.router.navigate(['/reservas-paciente']);
        })
        .catch(async error => {
          console.error('Error al guardar la reserva:', error);
          const toast = await this.toastController.create({
            message: 'Error al crear la reserva',
            duration: 3000,
            color: 'danger'
          });
          toast.present();
        });
    }
  }
  
}