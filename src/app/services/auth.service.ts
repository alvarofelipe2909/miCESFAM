import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserI } from '../models/remedio.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userRole: string | undefined;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges();
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      if (user) {
        this.userRole = (user as any).role;
      } else {
        this.userRole = undefined;
      }
    });
  }
  getUserRole(): Observable<string | undefined> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
            map((userData: any) => userData?.role)
          );
        } else {
          return [undefined];
        }
      })
    );
  }

  async register(nombre:string, apellido:string, email: string, password: string, rut: string, role: string, especialidad: any) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      await this.firestore.collection('users').doc(userCredential.user?.uid).set({
        nombre,
        apellido,
        email,
        rut,
        role,
        especialidad: role === 'Medico' ? especialidad : null
      });
      this.userRole = role;
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  }
  async getUserUid(): Promise<string | null> {
    const user = await this.afAuth.currentUser;
    return user ? user.uid : null;
  }

  getRole(): string | undefined {
    return this.userRole;
  }

  async loginWithRut(rut: string, password: string) {
    try {
      const userSnapshot = await this.firestore.collection('users', ref => ref.where('rut', '==', rut)).get().toPromise();

      if (userSnapshot && !userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0];
        const email = (userDoc.data() as { email: string }).email;
        const userCredential = await this.afAuth.signInWithEmailAndPassword(email, password);
        this.userRole = (userDoc.data() as { role: string }).role;
        this.router.navigate(['/home']);
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      throw error;
    }
  }
  getUserInfo(uid: string, otherUid: string): Observable<UserI | null> {
    const path = `Users/${uid}`;
    return this.firestore.doc<UserI>(path).valueChanges().pipe(
      map(user => user ? user : null)
    );
  }
  getUserRut(uid: string): Observable<string> {
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map((user: any) => user.rut)
    );
  }
  stateAuth(): Observable<any> {
    return this.afAuth.authState;
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.afAuth.currentUser;
  }

  getCurrentUser(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection('users').doc(user.uid).valueChanges().pipe(
            map(userData => userData ? ({ uid: user.uid, ...userData }) : { uid: user.uid })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  getUserRoleFromFirestore(uid: string): Observable<string | undefined> {
    if (this.userRole) {
      return of(this.userRole); // Retorna el rol cacheado si está disponible
    }
  
    return this.firestore.collection('users').doc(uid).valueChanges().pipe(
      map(user => {
        const role = (user as any)?.role;
        this.userRole = role; // Cachea el rol
        return role;
      })
    );
  }
  
  passwordReset(userEmail: string) {
    this.afAuth.sendPasswordResetEmail(userEmail)
    .then(() => {

      console.log("Password reset email sent successfully!");
    })
    .catch((error) => {
      console.error("Error sending password reset email:", error);
    });
  }

}