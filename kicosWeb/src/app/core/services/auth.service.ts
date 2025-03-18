import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse  } from '@angular/common/http';
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

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

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
  logout() {
    const token = this.getToken();

    if (token) {
      console.log('Jeton trouvé pour la déconnexion');
      // return
    } else if (!token) {
      console.error('Aucun jeton trouvé pour la déconnexion');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post(`${environment.base_url}/deconnexion`, {}, { headers })
      .subscribe(
        () => {
          this.clearSession();
          this.router.navigate(['/login']);
          this.messageService.createMessage(
            'success',
            'Déconnexion réussie avec succés'
          );
          this.logoutSubject.next(); // Notifie les abonnés de la déconnexion
          console.log('Déconnexion réussie avec succés');
        },
        (error) => {
          console.error('Erreur de déconnexion: ', error);
        }
      );
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
    if (response && response.access_token && response.expires_in) {
      // this.setToken(response.access_token, response.expires_in);
      this.logTokenExpiration();
    } else {
      console.error("Réponse d'authentification invalide");
    }
  }

  // Stocke le jeton d'authentification
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    // const expirationDate = new Date().getTime() + expiresIn * 1000;
    // localStorage.setItem('tokenExpiration', expirationDate.toString());
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
}
