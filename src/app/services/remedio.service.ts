import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RemedioService {
  private remediosCollection = this.firestore.collection('remedios');

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getRemedios(): Observable<any[]> {
    return this.remediosCollection.valueChanges({ idField: 'id' });
  }

  addRemedio(remedio: any, file: File): Observable<void> {
    const filePath = `remedios/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    return new Observable(observer => {
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            remedio.imageUrl = url;
            const id = this.firestore.createId();
            this.remediosCollection.doc(id).set(remedio).then(() => {
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

  updateRemedio(id: string, remedio: any): Promise<void> {
    return this.remediosCollection.doc(id).update(remedio);
  }

  deleteRemedio(id: string): Promise<void> {
    return this.remediosCollection.doc(id).delete();
  }
}