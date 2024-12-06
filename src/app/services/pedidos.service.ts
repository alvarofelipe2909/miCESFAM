import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private pedidosCollection = this.firestore.collection('pedidos');
  private remediosCollection = this.firestore.collection('remedios');

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage) { }

  getPedidos(): Observable<any[]> {
    return this.pedidosCollection.valueChanges({ idField: 'id' });
  }

  raiseFlag(id: string): Promise<void> {
    return this.firestore.collection('pedidos').doc(id).update({ flag_validacion: true});
  }

  updateCantidad(id: string | undefined, cantidadNueva: number): Promise<void> {
    return this.remediosCollection.doc(id).update({cantidad: cantidadNueva});
  }
}
