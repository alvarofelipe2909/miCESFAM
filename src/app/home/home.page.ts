import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userRole: string | undefined;
  loading: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.authService.getUserRoleFromFirestore(user.uid).subscribe(role => {
          this.userRole = role;
          console.log('User role:', this.userRole); // Mensaje de depuración
          this.redirectToRolePage();
        });
      } else {
        console.error('No user found');
        this.router.navigate(['/login']);
      }
    });
  }

  normalizeRole(role: string | undefined): string | undefined {
    if (!role) return undefined;
    return role.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  redirectToRolePage() {
    const normalizedRole = this.normalizeRole(this.userRole);
    if (!normalizedRole) {
      console.error('No user role found');
      return;
    }

    switch (normalizedRole) {
      case 'paciente':
        this.router.navigate(['/paciente']);
        break;
      case 'medico':
        this.router.navigate(['/medico']);
        break;
      case 'farmaceutico':
        this.router.navigate(['/farmaceutico']);
        break;
      case 'administrativo':
        this.router.navigate(['/administrativo']);
        break;
      default:
        console.error('Unknown user role:', normalizedRole);
        this.loading = false;
        this.router.navigate(['/home']);
        break;
    }
  }
}