import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Injectable } from '@angular/core';

(window as any).Pusher = Pusher;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private echo!: Echo<any>;

  constructor() {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: 'b4f9d7a49fca6dc7af58',
      cluster: 'eu',
      forceTLS: true,
      encrypted: true,
      enabledTransports: ['ws', 'wss'],
      logToConsole: true
    });

    (window as any).Echo = this.echo;
  }

  subscribeToLivreurNotifications(cb: (data: any) => void) {

    this.echo
      .channel('commandes-public')
      .listen('.CommandeAssignee', (data: any) => {
        cb(data);
      })
      .error((err: any) => {
        console.error('❌ Erreur lors de l’écoute du canal public :', err);
      });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
