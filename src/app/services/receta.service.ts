import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecetaService {
  private recetasCollection = this.firestore.collection('recetas');

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getRecetas(): Observable<any[]> {
    return this.recetasCollection.valueChanges({ idField: 'id' });
  }

  getRecetasByRut(rut: string): Observable<any[]> {
    return this.firestore.collection('recetas', ref => ref.where('rutPaciente', '==', rut)).valueChanges({ idField: 'id' });
  }

  addReceta(receta: any, pdfBlob: Blob): Observable<void> {
    const filePath = `recetas/${receta.rutPaciente}_${new Date().getTime()}.pdf`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, pdfBlob);

    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            receta.pdfUrl = url;
            const id = this.firestore.createId();
            this.recetasCollection.doc(id).set(receta).then(() => {
              observer.next();
              observer.complete();
            }).catch(error => {
              observer.error(error);
            });
          });
        })
      ).subscribe();
    });
  }

  updateReceta(id: string, receta: any): Promise<void> {
    return this.recetasCollection.doc(id).update(receta);
  }

  deleteReceta(id: string): Promise<void> {
    return this.recetasCollection.doc(id).delete();
  }

  getPacientes(): Observable<any[]> {
    return this.firestore.collection('pacientes').valueChanges({ idField: 'id' });
  }
}