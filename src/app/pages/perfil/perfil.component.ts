import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AnimationController } from '@ionic/angular';
import { UserI } from 'src/app/models/remedio.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  user: UserI | null = null;
  isEditing = false;
  editableUser: Partial<UserI> | undefined;
  loading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private animationCtrl: AnimationController
  ) {}

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Cargando perfil...',
    });
    await loading.present();

    this.authService.getCurrentUser().subscribe(user => {
      this.user = user;
      this.editableUser = user ? { ...user } : undefined;
      this.loading = false;
      loading.dismiss();
      this.playAvatarAnimation();
    });
  }

  playAvatarAnimation() {
    const animation = this.animationCtrl.create()
      .addElement(document.querySelector('.avatar-container') as Element)
      .duration(1500)
      .iterations(1)
      .fromTo('transform', 'scale(0.5)', 'scale(1)')
      .fromTo('opacity', '0.2', '1');
    animation.play();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.editableUser = { ...this.user };
    }
  }

  async saveChanges() {
    if (this.editableUser?.nombre?.trim() === '') {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El nombre no puede estar vacío.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    if (this.editableUser) {
      this.user = {
        ...this.user,
        ...this.editableUser,
        rut: this.editableUser?.rut ?? this.user?.rut ?? '',
        nombre: this.editableUser?.nombre ?? this.user?.nombre ?? '',
        email: this.editableUser?.email ?? this.user?.email ?? '',
        apellido: this.editableUser?.apellido ?? this.user?.apellido ?? '',
        rol: this.editableUser?.rol ?? this.user?.rol ?? '',
        especialidad: this.editableUser?.especialidad ?? this.user?.especialidad ?? '',
        uid: this.editableUser?.uid ?? this.user?.uid ?? '',
      };
      this.isEditing = false;
    }
  }

  async logout() {
    const confirm = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          handler: () => {
            this.authService.logout().then(() => {
              this.router.navigate(['/login']);
            });
          },
        },
      ],
    });

    await confirm.present();
  }

  get nombreCompleto(): string {
    return `${this.user?.nombre || ''} ${this.user?.apellido || ''}`.trim();
  }
}
