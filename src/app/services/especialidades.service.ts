import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadesService {
  constructor(private firestore: AngularFirestore) { }

  // Método para obtener las especialidades desde Firestore
  getEspecialidades(): Observable<string[]> {
    return this.firestore.collection('especialidades').snapshotChanges().pipe(
      map((actions: any[]) => actions.map(a => {
        const data = a.payload.doc.data() as { nombre: string };
        return data.nombre;
      }))
    );
  }
}