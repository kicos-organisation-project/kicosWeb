import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private pusher: Pusher;

  constructor() {
    this.pusher = new Pusher('b4f9d7a49fca6dc7af58', {
      cluster: 'eu',
      forceTLS: true
    });

    this.pusher.connection.bind('connected', () => {
      console.log('Connecté à Pusher!');
    });

    this.pusher.connection.bind('error', (err: any) => {
      console.error('Erreur de connexion Pusher:', err);
    });

    
  }

  subscribeToLivreurNotifications(livreurId: number | string, callback: (data: any) => void): void {
    const channelName = `livreur.${livreurId}`;
    const channel = this.pusher.subscribe(channelName);

    console.log(`Abonné au channel: ${channelName}`);

    channel.bind('pusher:subscription_succeeded', () => {
      console.log('✅ Abonnement au channel réussi');
    });
    
    channel.bind('pusher:subscription_error', (status: any) => {
      console.error('❌ Erreur abonnement au channel:', status);
    });
    
    channel.bind('NotificationCommande', (data: any) => {
      console.log('Nouvelle notification de commande:', data);
      callback(data);
    });
  }
}
