import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    _next: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getCurrentUser().pipe(
      take(1),
      switchMap(user => {
        if (user) {
          return this.authService.getUserRoleFromFirestore(user.uid);
        } else {
          this.router.navigate(['/login']);
          return [false];
        }
      }),
      map(role => {
        const normalizedRole = typeof role === 'string' ? this.normalizeRole(role) : undefined;
        if (normalizedRole) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
    private normalizeRole(role: string | undefined): string | undefined {
      if (!role) {
        return undefined;
      }
      return removeAccents(role.toLowerCase());
    }
  }

    function removeAccents(str: string): string {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

