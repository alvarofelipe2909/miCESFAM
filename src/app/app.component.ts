import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { NotificationsComponent } from "src/app/pages/notifications/notifications.component";
import { AuthService } from 'src/app/services/auth.service';
import { UserI } from 'src/app/models/remedio.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  login: boolean = false;
  user: UserI | null = null;
  rol: string = '';

  constructor(private popoverController: PopoverController,
              private auth: AuthService,
  ) {}

  async presentNotifications(ev: any) {
    const popover = await this.popoverController.create({
      component: NotificationsComponent,
      event: ev,
      translucent: true,
      cssClass: 'notifications-popover'
    });
    await popover.present();
  }
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

}