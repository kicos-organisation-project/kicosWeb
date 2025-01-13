import {
  HttpEvent,
  HttpHandlerFn,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  // Nom de la clé sous laquelle le jeton est stocké dans le localStorage
  const tokenKey = 'session_id';

  // Récupération du jeton depuis le localStorage
  const token = localStorage.getItem(tokenKey);

  if (!token) {
    console.log("Token d'utilisateur non présent");
    return next(req);
  }

  console.log("Token d'utilisateur présent");

  // Données à ajouter dans l'en-tête de la requête
  const headers = req.headers.set('Authorization', `Bearer ${token}`);

  // Clonage de la requête en y ajoutant le header
  const newReq = req.clone({ headers });

  // On retourne maintenant la requête clonée
  return next(newReq);
}
