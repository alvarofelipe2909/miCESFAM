import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ver-disponibilidad',
  templateUrl: './ver-disponibilidad.component.html',
  styleUrls: ['./ver-disponibilidad.component.scss'],
})
export class VerDisponibilidadComponent implements OnInit {
  disponibilidades: any[] = [];
  userId: string = '';
  editando: string | null = null;
  nuevasFechas: string[] = [];
  nuevasHoras: string[] = [];
  new: any;
  minDate: string = new Date().toISOString().split('T')[0];
  idSeleccionada: string | undefined;


  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.obtenerDisponibilidades();
      }
    });
  }

  obtenerDisponibilidades() {
    this.firestore
      .collection('disponibilidad', ref => ref.where('medicoId', '==', this.userId))
      .valueChanges({ idField: 'id' })
      .subscribe(data => {
        this.disponibilidades = data;
      });
  }

  eliminarDisponibilidad(id: string) {
    this.firestore
      .collection('disponibilidad')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Disponibilidad eliminada exitosamente');
      })
      .catch(error => {
        console.error('Error al eliminar disponibilidad: ', error);
      });
  }

  iniciarEdicion(disponibilidad: any) {
    this.editando = disponibilidad.id;
    this.nuevasFechas = [...disponibilidad.fechas];
    this.nuevasHoras = [...disponibilidad.horas];
  }

  guardarEdicion(id: string) {
    this.actualizarDisponibilidad(id, this.nuevasFechas, this.nuevasHoras);
    this.cancelarEdicion();
  }

  cancelarEdicion() {
    this.editando = null;
    this.nuevasFechas = [];
    this.nuevasHoras = [];
  }

  actualizarDisponibilidad(id: string, nuevasFechas: string[], nuevasHoras: string[]) {
    this.firestore
      .collection('disponibilidad')
      .doc(id)
      .update({ fechas: nuevasFechas, horas: nuevasHoras })
      .then(() => {
        console.log('Disponibilidad actualizada exitosamente');
      })
      .catch(error => {
        console.error('Error al actualizar disponibilidad: ', error);
      });
  }

  toggleHora(hora: string) {
    if (this.nuevasHoras.includes(hora)) {
      this.nuevasHoras = this.nuevasHoras.filter(h => h !== hora);
    } else {
      this.nuevasHoras.push(hora);
    }
  }
  actualizarFechas(value: string | string[] | null | undefined) {
    if (Array.isArray(value)) {
      this.nuevasFechas = value;
    } else {
      this.nuevasFechas = []; // Si no es válido, se asigna un array vacío
    }
  }
  
  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };
  agregarHora() {
    this.nuevasHoras.push(''); // Añade un campo vacío para que el usuario lo rellene
  }

  eliminarHora(hora: string) {
    this.nuevasHoras = this.nuevasHoras.filter(h => h !== hora);
  }
  
  actualizarHora(hora: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement) {
      const valor = inputElement.value;
      // Lógica para actualizar la hora con el valor
      console.log(`Hora actualizada: ${hora}, Nuevo valor: ${valor}`);
    }
  }
  
  guardarCambios() {
    if (this.idSeleccionada) {
      this.actualizarDisponibilidad(this.idSeleccionada, this.nuevasFechas, this.nuevasHoras);
    } else {
      console.error('No se ha seleccionado ninguna disponibilidad para actualizar');
    }
    console.log('Cambios guardados:', { fechas: this.nuevasFechas, horas: this.nuevasHoras });
  }
  
  // Función para cancelar cambios
  cancelarCambios() {
    this.nuevasFechas = []; // Limpia las fechas seleccionadas
    this.nuevasHoras = []; // Limpia las horas
    console.log('Cambios cancelados');
  }
}
