import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicoExamenesService {
  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getPacientes(): Observable<any[]> {
    return this.firestore.collection('users', ref => ref.where('role', '==', 'Paciente')).valueChanges({ idField: 'id' });
  }

  subirExamen(pacienteId: string, archivo: File, descripcion: string): Observable<any> {
    const filePath = `examenes/${pacienteId}/${archivo.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, archivo);

    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            this.firestore.collection('examenes').add({
              pacienteId,
              url,
              nombreArchivo: archivo.name,
              descripcion,
              fecha: new Date()
            }).then(() => {
              observer.next({ url });
              observer.complete();
            }).catch(error => {
              observer.error(error);
            });
          });
        })
      ).subscribe();
    });
  }

  getExamenes(pacienteId: string): Observable<any[]> {
    return this.firestore.collection('examenes', ref => ref.where('pacienteId', '==', pacienteId)).valueChanges({ idField: 'id' });
  }

  eliminarExamen(examenId: string, filePath: string): Promise<void> {
    return this.storage.ref(filePath).delete().toPromise().then(() => {
      return this.firestore.collection('examenes').doc(examenId).delete();
    });
  }
}