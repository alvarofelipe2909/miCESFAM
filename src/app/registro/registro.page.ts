import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EspecialidadesService } from '../services/especialidades.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {
  
  email: string = '';
  password: string = '';
  rut: string = '';
  errorMensaje: string = '';
  successMensaje: string = '';
  nombre: string = '';
  apellido: string = '';
  celular: number = 0;
  especialidades: any = [];

  registerForm: FormGroup;
  isMedico: boolean = false; // Nueva variable para manejar la visibilidad del campo especialidad
  

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private especialidadesService: EspecialidadesService) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      especialidad: [''],
    }, { validator: this.passwordsMatchValidator });

    this.especialidadesService.getEspecialidades().subscribe(data =>{
      this.especialidades = data;
    });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
  
    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordsDontMatch: true });
      return { passwordsDontMatch: true };
    } else {
      return null;
    }
  }

  onRegister() {
    if (this.registerForm && this.registerForm.valid) {
      const { nombre,apellido,email, rut, password, role, especialidad } = this.registerForm.value;
      
      // Pasar especialidad solo si es médico
      const userData: {nombre: string; apellido:string; email: string; password: string; rut: string; role: string; especialidad?: string } = { nombre, apellido, email, password, rut, role };
      if (role === 'Médico') {
        userData.especialidad = especialidad;
      }

      this.authService.register(nombre,apellido,email, password, rut, role, especialidad).then(() => {
        this.successMensaje = 'Registro exitoso';
        this.errorMensaje = '';

        setTimeout(() => {
          this.router.navigate(['/home']); // Redirige al login después del registro exitoso
        }, 3000);
      }).catch((error) => {
        this.errorMensaje = 'Error al registrarse';
        this.successMensaje = '';
        console.error('Error en el registro:', error);
      });
    }
  }
}
