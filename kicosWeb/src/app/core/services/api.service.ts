import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  // Recupere l'url de base de l'api
  getBaseUrl() {
    return environment.base_url;
  }

  // ------------------------ Sans session_id ---------------------------------
  // Faire une requete de type post
  post(endpoint: string, data: object | FormData | any) {
    return this.http.post(endpoint, data);
  }

  // Faire une requete de type put
  put(endpoint: string, data: object | FormData | any) {
    return this.http.put(endpoint, data);
  }
  // Faire une requete de type put
  CustomPut(endpoint: string, data: object | FormData | any, id: number) {
    return this.http.put(`${environment.base_url}/${endpoint}/${id}`,data);
  }

  // getElementById or liste elements
  get(id: any = null, endpoint: string) {
    return this.http.get(`${endpoint}${id ? '/' + id : ''}`);
  }

  // ajout simple
  customPostGet(endpoint: string, data: any) {
    return this.http.post(`${environment.base_url}/${endpoint}`,data);
  }

  // Recupere une liste de données en lui passant l'entité
  getRequest(endpoint: string) {
    return this.http.get(`${environment.base_url}/${endpoint}`,);
  }

  // Supprime un élément spécifique.
  delete(id: string | number, endpoint: string) {
    return this.http.delete(`${endpoint}/${id}`);
  }

  // ------------------------ Avec session_id ---------------------------------

  // Faire une requete de type post
  postWithSessionId(endpoint: string, data: object | FormData | any) {
    let headers = new HttpHeaders();
    headers = headers.set('session_id','' + localStorage.getItem('session_id'));
    return this.http.post(endpoint, data, { headers: headers });
  }

  // Faire une requete de type put
  putWithSessionId(endpoint: string, data: object | FormData | any) {
    let headers = new HttpHeaders();
    headers = headers.set('session_id','' + localStorage.getItem('session_id'));
    return this.http.put(endpoint, data, { headers: headers });
  }

  // getElementById or liste elements
  getWithSessionId(id: any = null, endpoint: string) {
    let headers = new HttpHeaders();
    headers = headers.set('session_id','' + localStorage.getItem('session_id'));
    return this.http.get(`${endpoint}${id ? '/' + id : ''}`, {
      headers: headers,
    });
  }

  // Recupere une liste de données en lui passant l'entité
  getRequestWithSessionId(endpoint: string) {
    let headers = new HttpHeaders();
    headers = headers.set('session_id','' + localStorage.getItem('session_id'));
    return this.http.get(endpoint, { headers: headers });
  }

  // Supprime un élément spécifique.
  deleteWithSessionId(id: string | number, endpoint: string | any) {
    let headers = new HttpHeaders();
    headers = headers.set('session_id','' + localStorage.getItem('session_id'));
    return this.http.delete(`${endpoint}/${id}`, { headers: headers });
  }
}
