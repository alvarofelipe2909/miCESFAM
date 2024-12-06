import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { UserI } from 'src/app/models/remedio.model';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  login: boolean = false;
  rol: string = '';
  user: UserI | null = null;

  constructor(public popoverController: PopoverController,
              private auth: AuthService,
              private interaction: InteractionService,
              private router: Router) {}

  ngOnInit() {
    this.auth.stateAuth().subscribe(res => {
      if (res) {
        this.login = true;
        this.getUserInfo(res.uid);
      } else {
        this.login = false;
      }
    });
  }

  getUserInfo(uid: string) {
    this.auth.getUserInfo(uid, uid).subscribe((res: UserI | null) => {
      if (res) {
        this.user = res;
        this.rol = res.rol;
      }
    });
  }

  logout() {
    this.auth.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }

  goToHome() {
    const userRole = this.auth.getRole();
    if (userRole) {
      const normalizedRole = userRole.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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
          this.router.navigate(['/home']);
          break;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  
  
}