import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
    providedIn: 'root'
})
  export class EmailService {

  public sendEmailMedicamento(nombre_paciente: string, medicamentos: string, email_paciente: string) {
    emailjs.init('2Z3DKCnD_Gy8yfQdd')
    emailjs.send('service_oa4jt7w', 'template_be13mbn',
        {
            to_name: nombre_paciente,
            lista_medicamentos: medicamentos,
            to_email: email_paciente
        }
    ).then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (error) => {
          console.log('FAILED...', error);
        },
      );
  }
  public sendEmailExamen(nombre_paciente: string, nombre_medico: string, descripcion: string, email_paciente: string){
    emailjs.init('2Z3DKCnD_Gy8yfQdd')
    emailjs.send('service_oa4jt7w', 'template_a0yx2jg',
      {
        to_name: nombre_paciente,
        to_name_doctor: nombre_medico,
        descripcion: descripcion,
        to_email: email_paciente
      }
    ).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (error) => {
        console.log('FAILED...', error);
      },
    )
  }
  public sendEmailReserva(nombre_paciente: string, nombre_medico: string, fecha_reserva: string, hora_reserva: string , email_paciente: string){
    emailjs.init('H933ghC3jsuadBPrp')
    emailjs.send('service_ye7dvn3', 'template_dfy33im',
      {
        to_name: nombre_paciente,
        to_name_doctor: nombre_medico,
        to_fecha: fecha_reserva,
        to_hora: hora_reserva,
        to_email: email_paciente
      }
    ).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (error) => {
        console.log('FAILED...', error);
      },
    )
  }
  public sendEmailEstado(nombre_paciente: string, nombre_medico: string, fecha_reserva: string, hora_reserva: string , estado_reserva: string, email_paciente: string){
    emailjs.init('H933ghC3jsuadBPrp')
    emailjs.send('service_ye7dvn3', 'template_zvnlmoc',
      {
        to_name: nombre_paciente,
        to_name_doctor: nombre_medico,
        to_fecha: fecha_reserva,
        to_hora: hora_reserva,
        to_estado: estado_reserva,
        to_email: email_paciente
      }
    ).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (error) => {
        console.log('FAILED...', error);
      },
    )
  }
  public sendEmailMensaje(nombre_paciente: string, mensaje: string, email_paciente: string){
    emailjs.init('AkbTj4v0d8b2MIt4a')
    emailjs.send('service_bmkfbfa', 'template_isj4475',
      {
        to_name: nombre_paciente,
        to_mensaje: mensaje,
        to_email: email_paciente
      }
    ).then(
      (response) => {
        console.log('SUCCESS!', response.status, response.text);
      },
      (error) => {
        console.log('FAILED...', error);
      },
    )
  }
}