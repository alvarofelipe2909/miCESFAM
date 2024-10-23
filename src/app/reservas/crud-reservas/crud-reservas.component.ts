import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservaService } from 'src/app/services/reservas.service';
import { AuthService} from 'src/app/services/auth.service';
import { EspecialidadesService } from 'src/app/services/especialidades.service';

@Component({
  selector: 'app-crud-reservas',
  templateUrl: './crud-reservas.component.html',
  styleUrls: ['./crud-reservas.component.scss'],
})
export class CrudReservasComponent  implements OnInit {

  reservaForm: FormGroup | undefined;
  especialidades: any[] = [];
  medicos: any[] = [];
  isEditMode = false;
  reservaId: string = '';
  userRole: string | undefined;


  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private authService: AuthService,
    private especialidadesService: EspecialidadesService // Inyectar el servicio de especialidades
  ) {}

  ngOnInit() {
    this.initializeForm();

    // Verificar si es edición
    this.reservaId = this.route.snapshot.paramMap.get('id') || '';
    if (this.reservaId) {
      this.isEditMode = true;
      this.loadReserva(this.reservaId);
    }

    // Cargar las especialidades y médicos (si ya tienes estos datos)
    this.loadEspecialidades();
    this.loadMedicos();

    // Obtener el rol del usuario
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.getUserRoleFromFirestore(user.uid).subscribe(role => {
          this.userRole = role;
        });
      } else {
        console.error('No user found');
        this.router.navigate(['/login']);
      }
    });

  }

  

  initializeForm() {
    this.reservaForm = this.fb.group({
      especialidad: ['', Validators.required],
      medicoId: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      estado: ['', Validators.required],
    });
  }

  loadEspecialidades() {
    this.especialidadesService.getEspecialidades().subscribe((data: any[]) => {
      this.especialidades = data;
    })
  }

  loadMedicos() {
    this.reservaService.getMedicos().subscribe(data => {
      this.medicos = data;
    });
  }

  loadReserva(id: string) {
    this.reservaService.obtenerReserva(id).subscribe((reserva) => {
      if (this.reservaForm) {
        this.reservaForm.patchValue(reserva);
      }
    });
  }

  onSubmit() {
    if (this.reservaForm?.valid) {
      if (this.isEditMode) {
        this.reservaService.actualizarReserva(this.reservaId, this.reservaForm.value)
          .then(() => {
            this.redirectBasedOnRole(); // Redirige basado en el rol del usuario
          })
          .catch(error => console.log(error));
      } else {
        this.reservaService.crearReserva(this.reservaForm.value)
          .then(() => {
            this.redirectBasedOnRole(); // Redirige basado en el rol del usuario
          })
          .catch(error => console.log(error));
      }
    }
  }

  redirectBasedOnRole() {
    if (this.userRole === 'Administrativo') {
      this.router.navigate(['/reservas-administrativo']);
    } else if (this.userRole === 'Paciente') {
      this.router.navigate(['/reservas-paciente']);
    } else {
      this.router.navigate(['/login']); // Redirige a la página principal si el rol no es reconocido
    }
  }

}



