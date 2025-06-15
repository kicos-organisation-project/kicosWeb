import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { environment } from '../../../environments/environment';
import { tap, catchError } from 'rxjs/operators';
import { throwError, Observable, Subject } from 'rxjs';

// Définir l'interface pour la réponse du login et du rafraîchissement du token
interface AuthResponse {
  access_token: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'session_id';
  private tokenExpirationKey = 'tokenExpiration';
  private logoutSubject = new Subject<void>();
  private sessionWarningTimer: any = null;
  private readonly TOKEN_DURATION_MS = 60 * 60 * 1000; // 1h


  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  // Connexion de l'utilisateur
  login(credentials: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.base_url}/login-web`, credentials)
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
        }),
        catchError((error) => {
          console.error('Erreur de connexion: ', error);
          return throwError(() => new Error('Erreur de connexion'));
        })
      );
  }

  // Déconnexion de l'utilisateur
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
    this.messageService.createMessage('info', 'Vous avez été déconnecté.');
    this.logoutSubject.next();

    if (this.sessionWarningTimer) {
      clearTimeout(this.sessionWarningTimer);
      this.sessionWarningTimer = null;
    }
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();
    if (!token || expiration === null || expiration <= new Date().getTime()) {
      console.log('Le token est expiré ou non présent');
      return false;
    }

    return true;
  }

  // Rafraîchir le token
  refreshToken(): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.base_url}/refresh-token`, {})
      .pipe(
        tap((response) => {
          this.handleAuthResponse(response);
        }),
        catchError((error) => {
          this.logout(); // Déconnexion si l'échec de rafraîchissement
          return throwError(
            () => new Error('Échec du rafraîchissement du token')
          );
        })
      );
  }

  // Gestion de la réponse d'authentification
  private handleAuthResponse(response: AuthResponse): void {
    if (response && response.access_token) {
      // this.setToken(response.access_token, response.expires_in);
      this.logTokenExpiration();
    } else {
      console.error("Réponse d'authentification invalide");
    }
  }

  // Stocke le jeton d'authentification
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);

    const expirationDate = new Date().getTime() + (59 * 60 * 1000); // 1h
    localStorage.setItem(this.tokenExpirationKey, expirationDate.toString());

    this.startSessionWarningTimer(); // ⬅️ Ajoute cette ligne
  }


  // Récupère le jeton d'authentification
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Récupère le temps d'expiration du jeton
  private getTokenExpiration(): number | null {
    const expiration = localStorage.getItem(this.tokenExpirationKey);
    return expiration ? parseInt(expiration, 10) : null;
  }

  // Efface la session
  private clearSession() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
  }

  // Affiche le temps restant avant expiration du token
  private logTokenExpiration(): void {
    const expirationTime = this.getTokenExpiration();
    const currentTime = new Date().getTime();
    const timeLeft = expirationTime ? expirationTime - currentTime : 0;

    if (timeLeft > 0) {
      console.log(
        `Token valide pour encore ${Math.floor(timeLeft / 1000)} secondes.`
      );
    } else {
      console.log('Token expiré.');
    }
  }

  // Observable pour écouter les déconnexions
  get logoutObservable(): Observable<void> {
    return this.logoutSubject.asObservable();
  }

  // Exemple d'utilisation dans une requête authentifiée
  makeAuthenticatedRequest<T>(
    url: string,
    options: { headers?: HttpHeaders } = {}
  ): Observable<T> {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login']);
      return throwError(
        () => new Error('Utilisateur non authentifié ou token expiré')
      );
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.getToken()}`);
    options.headers = headers;

    return this.http.get<T>(url, options).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log(
            'Erreur 401 reçue, redirection vers la page de connexion'
          );
          this.clearSession();
          this.router.navigate(['/login']);
        }
        return throwError(
          () => new Error('Erreur lors de la requête authentifiée')
        );
      })
    );
  }


  private startSessionWarningTimer(): void {
    if (this.sessionWarningTimer) {
      clearTimeout(this.sessionWarningTimer);
    }

    const expiration = this.getTokenExpiration();
    if (!expiration) return;

    const now = Date.now();
    const timeUntilLogout = expiration - now;

    if (timeUntilLogout <= 0) {
      this.logout();
      return;
    }

    this.sessionWarningTimer = setTimeout(() => {
      this.messageService.createMessage('warning', 'Session expirée. Déconnexion dans 10 secondes...');
      setTimeout(() => {
        this.logout();
      }, 10000); // délai de 10 secondes
    }, timeUntilLogout);
  }


}
