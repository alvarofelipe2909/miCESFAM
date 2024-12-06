import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadService {

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthService
  ) {}

  // Método para obtener la disponibilidad de un médico
  getDisponibilidadByMedicoId(medicoId: string) {
    return this.firestore.collection('disponibilidad', ref => ref.where('medicoId', '==', medicoId)).valueChanges();
  }

  // Método para agregar la disponibilidad del médico
  addDisponibilidad(disponibilidad: any) {
    return this.firestore.collection('disponibilidad').add(disponibilidad);
  }
}
