import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { Injectable, NgZone } from '@angular/core';
import { environment } from '../../../environments/environment';

(window as any).Pusher = Pusher;

export type RealtimeCallback = (data: any) => void;

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private echo!: Echo<'pusher'>;
  private permissionAsked = false;

  constructor(private zone: NgZone) {
    this.initEcho();
  }

  private initEcho(): void {
    this.echo = new Echo({
      broadcaster: 'pusher',
      key: environment.pusher.key,
      cluster: environment.pusher.cluster,
      forceTLS: true,
      encrypted: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.base_url.replace(/\/api\/?$/, '')}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${this.getToken() || ''}`,
        },
      },
    });

    (window as any).Echo = this.echo;
  }

  /** Demande la permission notifications navigateur (PWA / mobile). */
  async ensureNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return Notification.permission;
    }
    if (this.permissionAsked) {
      return Notification.permission;
    }
    this.permissionAsked = true;
    return Notification.requestPermission();
  }

  showLocalNotification(title: string, options?: NotificationOptions): void {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return;
    }

    const payload: NotificationOptions & { vibrate?: number[] } = {
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      vibrate: [120, 60, 120],
      ...options,
    };

    try {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.showNotification(title, payload as any);
        });
      } else {
        new Notification(title, payload as any);
      }
    } catch {
      new Notification(title, payload as any);
    }
  }

  subscribeToLivreurNotifications(cb: RealtimeCallback): void {
    void this.ensureNotificationPermission();

    this.echo
      .channel('commandes-public')
      .listen('.CommandeAssignee', (data: any) => {
        this.zone.run(() => {
          this.showLocalNotification('Nouvelle commande Kicos', {
            body: data?.message || 'Une commande est à accepter',
            tag: `commande-${data?.commande_id || Date.now()}`,
            data,
            requireInteraction: true,
          });
          cb(data);
        });
      })
      .error((err: any) => {
        console.error('Erreur canal commandes-public:', err);
      });
  }

  /** Abonnement générique canal public + event Laravel (dot-prefixed). */
  listenPublic(channel: string, event: string, cb: RealtimeCallback): void {
    void this.ensureNotificationPermission();
    this.echo
      .channel(channel)
      .listen(event.startsWith('.') ? event : `.${event}`, (data: any) => {
        this.zone.run(() => cb(data));
      });
  }

  leaveChannel(channel: string): void {
    this.echo.leave(channel);
  }

  getToken(): string | null {
    return localStorage.getItem('session_id');
  }

  /** Rebind auth header after login. */
  refreshAuth(): void {
    const pusherConfig = (this.echo?.connector?.pusher?.config as any);
    if (pusherConfig?.auth?.headers) {
      pusherConfig.auth.headers['Authorization'] =
        `Bearer ${this.getToken() || ''}`;
    }
  }
}
