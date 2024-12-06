import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss'],
})
export class ContactoComponent implements OnInit {
  contactoForm: FormGroup | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.contactoForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      asunto: ['', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  async onSubmit() {
    if (this.contactoForm && this.contactoForm.valid) {
      const formData = this.contactoForm.value;

      // Simular el envío del formulario
      console.log('Formulario enviado:', formData);

      // Mostrar un mensaje de confirmación
      await this.showToast('Mensaje enviado con éxito.', 'success');

      // Opcional: Resetear el formulario
      this.contactoForm.reset();
    } else {
      await this.showToast('Por favor, completa todos los campos correctamente.', 'danger');
    }
  }

  private async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
