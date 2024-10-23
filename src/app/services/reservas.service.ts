import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {


  constructor(private firestore: AngularFirestore) {}

  // Crear reserva
  crearReserva(reserva: any): Promise<void> {
    const id = this.firestore.createId();
    return this.firestore.collection('reservas').doc(id).set(reserva);
  }

  getMedicos(): Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('role', '==', 'Médico')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Obtener reservas por paciente
  obtenerReservasPorPaciente(pacienteId: string): Observable<any[]> {
    return this.firestore.collection('reservas', ref => ref.where('pacienteId', '==', pacienteId)).valueChanges();
  }

  // Obtener reservas por médico
  obtenerReservasPorMedico(medicoId: string): Observable<any[]> {
    return this.firestore.collection('reservas', ref => ref.where('medicoId', '==', medicoId)).valueChanges();
  }

  // Obtener todas las reservas (para administrativo)
  obtenerTodasReservas(): Observable<any[]> {
    return this.firestore.collection('reservas').valueChanges();
  }
  // Obtener una reserva específica por ID
  obtenerReserva(id: string): Observable<any> {
  return this.firestore.collection('reservas').doc(id).valueChanges();
}

  // Actualizar una reserva
  actualizarReserva(id: string, reserva: any): Promise<void> {
    return this.firestore.collection('reservas').doc(id).update(reserva);
  }

  // Eliminar una reserva
  eliminarReserva(id: string): Promise<void> {
    return this.firestore.collection('reservas').doc(id).delete();
  }
}
