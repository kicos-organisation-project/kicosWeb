import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Pusher from 'pusher-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private pusher!: Pusher;

  constructor(private http: HttpClient) {
    try {
      this.pusher = new Pusher('b4f9d7a49fca6dc7af58', {
        cluster: 'eu',
        forceTLS: true,
        authEndpoint: environment.base_url + '/broadcasting/auth', // URL relative pour éviter les problèmes CORS
        auth: {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
          }
        },
        authorizer: (channel, options) => {
          console.log('🔐 Headers envoyés:', options.auth?.headers);

          return {
            authorize: (socketId, callback) => {
              const data = {
                socket_id: socketId,
                channel_name: channel.name
              };
              console.log(data);
              
              const timeout = setTimeout(() => {
                console.error('⏱️ Timeout auth Pusher (>5s)');
                callback(new Error('Auth timeout'), null);
              }, 5000);

              this.http.post(
                options.authEndpoint,
                data,
                { headers: options.auth?.headers }
              ).subscribe({
                next: (response: any) => {
                  clearTimeout(timeout);
                  console.log('Réponse auth Pusher:', response);
                  callback(null, response);
                },
                error: (error) => {
                  clearTimeout(timeout);
                  console.error('❌ Erreur auth Pusher:', error);
                  callback(error, null);
                }
              });
            }
          };
        }
      });

      this.pusher.connection.bind('connected', () => {
        console.log('✅ Connecté à Pusher!');
      });

      this.pusher.connection.bind('error', (err: any) => {
        console.error('🛑 Erreur de connexion Pusher:', err);
      });

    } catch (err) {
      console.error('🚨 Erreur d\'initialisation de Pusher:', err);
    }
  }

  private getAuthToken(): string {
    // Vérifiez la clé correcte dans localStorage pour votre token JWT
    const token = localStorage.getItem('session_id') || localStorage.getItem('auth_token') || localStorage.getItem('access_token') || '';
    console.log('Token utilisé pour l\'authentification:', token ? 'Token présent' : 'Token absent');
    return token;
  }

  subscribeToLivreurNotifications(livreurId: number | string, callback: (data: any) => void): void {
    try {
      const token = this.getAuthToken();
      if (!token) {
        console.error('🚫 Pas de token d\'authentification disponible');
        return;
      }

      const channelName = `private-livreur.${livreurId}`;
      console.log(`📡 Tentative d'abonnement au channel: ${channelName}`);
      
      const channel = this.pusher.subscribe(channelName);
      
      // channel.bind('pusher:subscription_succeeded', () => {
      //   console.log('✅ Abonnement au channel réussi');
      // });

      channel.bind('NotificationCommande', (data: any) => {
        console.log('🔔 Notification de commande reçue:', data);
        callback(data);
      });
      channel.bind('pusher:subscription_error', (status: any) => {
        console.error('❌ Erreur abonnement au channel:', status);
      });


      // Global debug (désactivable en prod)
      channel.bind_global((eventName: string, data: any) => {
        console.log(`📥 Événement reçu: ${eventName}`, data);
      });

    } catch (err) {
      console.error('🚨 Erreur dans subscribeToLivreurNotifications:', err);
    }
  }

  unsubscribe(channelName: string): void {
    try {
      this.pusher.unsubscribe(channelName);
      console.log(`🚪 Désabonné du channel: ${channelName}`);
    } catch (err) {
      console.error('❌ Erreur de désabonnement:', err);
    }
  }
}