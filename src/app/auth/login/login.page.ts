import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  errorMensaje: string = '';
  succesMensaje: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      rut: ['', [Validators.required]], // Campo para RUT
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  validarRUT(rut: string): boolean {
    const cleanedRUT = rut.replace(/[^0-9kK]/g, '');
    if (cleanedRUT.length < 2) return false;

    const rutNumber = cleanedRUT.slice(0, -1);
    const rutDV = cleanedRUT.slice(-1).toLowerCase();

    let sum = 0;
    let multiplier = 2;
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber.charAt(i), 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const rutDVCalc = (11 - (sum % 11)).toString();
    const validarDV = rutDVCalc === '11' ? '0' : rutDVCalc === '10' ? 'k' : rutDVCalc;

    return validarDV === rutDV;
  }

  onLogin() {
    if (this.loginForm && this.loginForm.valid) {
      const { rut, password } = this.loginForm.value;
      this.authService.loginWithRut(rut, password).then(() => {
        this.succesMensaje = 'Inicio de sesión exitoso';
        this.errorMensaje = '';
        
        // Redirige al home si el inicio de sesión es exitoso
        this.router.navigate(['/home']);
      }).catch((error) => {
        this.errorMensaje = 'Error al iniciar sesión';
        this.succesMensaje = '';
        console.error('Error en el login:', error); // Imprime el error en consola
      });
    }
  }
}


