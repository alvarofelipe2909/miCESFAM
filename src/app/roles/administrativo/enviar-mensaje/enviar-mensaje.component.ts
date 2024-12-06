import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { EmailService } from 'src/app/services/email.service';
import { MedicoExamenesService } from 'src/app/services/medico-examenes.service';

@Component({
  selector: 'app-enviar-mensaje',
  templateUrl: './enviar-mensaje.component.html',
  styleUrls: ['./enviar-mensaje.component.scss'],
})
export class EnviarMensajeComponent implements OnInit {
  pacientes: any[] = [];
  pacientesFiltrados: any[] = [];
  pacienteSeleccionado: any = null;
  mensaje: string = '';
  busqueda: string = '';

  constructor(
    private medicoExamenesService: MedicoExamenesService,
    private emailService: EmailService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    // Obtener la lista de pacientes al inicializar el componente
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
  }

  async enviarMensaje() {
    if (!this.pacienteSeleccionado || !this.mensaje.trim()) {
      const toast = await this.toastController.create({
        message: 'Seleccione un paciente y escriba un mensaje',
        duration: 3000,
        color: 'warning',
        position: 'top'
      });
      toast.present();
      return;
    }

    try {
      // Llamar a la función para enviar el email
      this.emailService.sendEmailMensaje(
        this.pacienteSeleccionado.nombre,
        this.mensaje,
        this.pacienteSeleccionado.email
      );

      const toast = await this.toastController.create({
        message: 'Mensaje enviado exitosamente',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      toast.present();

      
      this.pacienteSeleccionado = null;
      this.mensaje = '';
      this.busqueda = '';

    } catch (error) {
      const toast = await this.toastController.create({
        message: 'Error al enviar el mensaje',
        duration: 3000,
        color: 'danger',
        position: 'top'
      });
      toast.present();
    }
  }
}
