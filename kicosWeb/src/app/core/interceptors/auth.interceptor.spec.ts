import { HttpHeaders, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  afterEach(() => localStorage.clear());

  it('passes through when no token', (done) => {
    const req = new HttpRequest('GET', '/api/test');
    authInterceptor(req, (r) => {
      expect(r.headers.has('Authorization')).toBeFalse();
      return of(new HttpResponse({ status: 200 }));
    }).subscribe(() => done());
  });

  it('adds Bearer Authorization when session_id exists', (done) => {
    localStorage.setItem('session_id', 'my-jwt');
    const req = new HttpRequest('GET', '/api/test', {
      headers: new HttpHeaders(),
    });

    authInterceptor(req, (r) => {
      expect(r.headers.get('Authorization')).toBe('Bearer my-jwt');
      return of(new HttpResponse({ status: 200 }));
    }).subscribe(() => done());
  });
});
