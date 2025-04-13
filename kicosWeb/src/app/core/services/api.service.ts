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
    return this.http.post(endpoint, data);
  }
 // Faire une requete de type put
 putRequest(endpoint: string, data: object | FormData | any) {
  return this.http.put(endpoint, data);
}

  // Faire une requete de type put
  CustomPut(endpoint: string, data: object | FormData | any, id: number) {
    return this.http.put(`${environment.base_url}/${endpoint}/${id}`,data);
  }

  // getElementById or liste elements
  get( endpoint: string) {
    return this.http.get(`${endpoint}`);
  }

  // ajout simple
  customPostGet(endpoint: string, data: any) {
    return this.http.post(`${environment.base_url}/${endpoint}`,data);
  }

  // Recupere une liste de données en lui passant l'entité
  getRequest(endpoint: string) {
    return this.http.get(`${endpoint}`,);
  }

  // Supprime un élément spécifique.
  delete(endpoint: string) {
    return this.http.delete(`${endpoint}`);
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
  deleteWithSessionId(endpoint: string | any) {
    let headers = new HttpHeaders();
    headers = headers.set('session_id','' + localStorage.getItem('session_id'));
    return this.http.delete(`${endpoint}`, { headers: headers });
  }
  
  // ------------------------ Autres ---------------------------------
  //  filtre general 
  filterByTerm(items: any[], term: string, properties: string[]): any[] {
    if (!term) return items;
    
    term = term.toLowerCase();
    
    return items.filter(item => {
      return properties.some(prop => {
        // Gérer les propriétés imbriquées (comme 'user.firstName')
        const props = prop.split('.');
        let value = item;
        
        for (const p of props) {
          if (value && value[p] !== undefined) {
            value = value[p];
          } else {
            return false;
          }
        }
        
        // Vérifier si la valeur contient le terme de recherche
        if (value !== null && value !== undefined) {
          return String(value).toLowerCase().includes(term);
        }
        
        return false;
      });
    });
  }

}