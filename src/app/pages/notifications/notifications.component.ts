import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.notificationsService.getNotifications().subscribe(notifications => {
      this.notifications = notifications.map(notification => ({
        ...notification,
        isRead: notification.isRead || false
      }));
    });
  }

  markAsRead(notificationId: string): void {
    this.notificationsService.markAsRead(notificationId).then(() => {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.isRead = true;
      }
    });
  }

  deleteNotification(notificationId: string): void {
    this.notificationsService.deleteNotification(notificationId).then(() => {
      this.notifications = this.notifications.filter(notification => notification.id !== notificationId);
    });
  }
}
