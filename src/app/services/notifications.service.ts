import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  getNotifications(): Observable<any[]> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('notifications', ref => ref.where('recipientId', '==', user.uid)).snapshotChanges().pipe(
            map((actions: any[]) => actions.map(a => {
              const data = a.payload.doc.data() as any;
              const id = a.payload.doc.id;
              return { id, ...data };
            }))
          );
        } else {
          return of([]);
        }
      })
    );
  }

  sendNotification(recipientId: string, message: string): Promise<DocumentReference<unknown>> {
    const notification = {
      recipientId,
      message,
      timestamp: new Date(),
      read: false
    };
    return this.firestore.collection('notifications').add(notification);
  }

  markAsRead(notificationId: string): Promise<void> {
    return this.firestore.collection('notifications').doc(notificationId).update({ read: true });
  }

  deleteNotification(notificationId: string): Promise<void> {
    return this.firestore.collection('notifications').doc(notificationId).delete();
  }
}