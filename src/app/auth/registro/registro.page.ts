import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { EspecialidadesService } from '../../services/especialidades.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage  {
  registerForm: FormGroup;
  isMedico: boolean = false;
  especialidades: string[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private especialidadesService: EspecialidadesService
  ) {
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
    

    this.especialidadesService.getEspecialidades().subscribe(data => {
      console.log('Especialidades disponibles:', data);
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

  onRoleChange(event: any) {
    this.isMedico = event.detail.value === 'Medico';
    if (this.isMedico) {
      this.registerForm.get('especialidad')?.setValidators([Validators.required]);
    } else {
      this.registerForm.get('especialidad')?.clearValidators();
    }
    this.registerForm.get('especialidad')?.updateValueAndValidity();
    console.log('Role seleccionado:', event.detail.value);
    console.log('isMedico:', this.isMedico);

  }

  onRegister() {
    if (this.registerForm && this.registerForm.valid) {
      console.log(this.registerForm.value);
      const { nombre, apellido, email, rut, password, role, especialidad } = this.registerForm.value;
      this.authService.register(nombre, apellido, email, password, rut, role, especialidad).then(() => {
        this.router.navigate(['/login']);
      }).catch(error => {
        console.error('Error al registrar:', error);
      });
    }
  }
}