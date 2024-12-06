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
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.authService.getUserRoleFromFirestore(user.uid).subscribe(
            role => {
              this.userRole = role;
              console.log('User role:', this.userRole);
              this.redirectToRolePage();
            },
            error => {
              console.error('Error fetching user role:', error);
              this.loading = false;
            }
          );
        } else {
          console.error('No user found');
          this.loading = false;
          
          this.router.navigate(['/login']);
        }
      },
      error => {
        console.error('Error fetching current user:', error);
        this.loading = false;
      }
    );
  }

  ionViewWillEnter() {
    // Redirección cada vez que el usuario navega al "home"
    this.loading = true;
    this.authService.getCurrentUser().subscribe(
      user => {
        if (user) {
          this.authService.getUserRoleFromFirestore(user.uid).subscribe(
            role => {
              this.userRole = role;
              console.log('User role:', this.userRole);
              this.redirectToRolePage();
            },
            error => {
              console.error('Error fetching user role:', error);
              this.loading = false;
            }
          );
        } else {
          console.error('No user found');
          this.loading = false;
          this.router.navigate(['/login']);
        }
      },
      error => {
        console.error('Error fetching current user:', error);
        this.loading = false;
      }
    );
  }

  redirectToRolePage() {
    if (!this.userRole) {
      console.error('User role is undefined');
      this.loading = false;
      this.router.navigate(['/home']);
      return;
    }

    const normalizedRole = this.userRole.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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
        this.router.navigate(['/home']);
        break;
    }
    this.loading = false;
  }
}