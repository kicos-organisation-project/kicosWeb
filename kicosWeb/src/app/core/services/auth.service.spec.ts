import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';
import { NotificationService } from './notification.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    localStorage.clear();
    router = jasmine.createSpyObj('Router', ['navigate']);
    messageService = jasmine.createSpyObj('MessageService', ['createMessage']);
    notificationService = jasmine.createSpyObj('NotificationService', ['refreshAuth']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: router },
        { provide: MessageService, useValue: messageService },
        { provide: NotificationService, useValue: notificationService },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated returns false without token', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('setToken stores token and expiration then isAuthenticated becomes true', () => {
    service.setToken('jwt-token');

    expect(localStorage.getItem('session_id')).toBe('jwt-token');
    expect(localStorage.getItem('tokenExpiration')).toBeTruthy();
    expect(service.isAuthenticated()).toBeTrue();
    expect(notificationService.refreshAuth).toHaveBeenCalled();
  });

  it('isAuthenticated returns false when token is expired', () => {
    localStorage.setItem('session_id', 'expired-token');
    localStorage.setItem('tokenExpiration', String(Date.now() - 1000));

    expect(service.isAuthenticated()).toBeFalse();
  });

  it('getDefaultHomeRoute maps roles correctly', () => {
    localStorage.setItem('userInfo', JSON.stringify({ role: 'admin' }));
    expect(service.getDefaultHomeRoute()).toBe('/kicos/admin');

    localStorage.setItem('userInfo', JSON.stringify({ role: 'partenaire' }));
    expect(service.getDefaultHomeRoute()).toBe('/kicos/commerce');

    localStorage.setItem('userInfo', JSON.stringify({ role: 'livreur' }));
    expect(service.getDefaultHomeRoute()).toBe('/kicos/livreur');

    localStorage.setItem('userInfo', JSON.stringify({ role: 'client' }));
    expect(service.getDefaultHomeRoute()).toBe('/login');
  });

  it('mustResetPassword reads and writes userInfo flag', () => {
    expect(service.mustResetPassword()).toBeFalse();

    service.setMustResetPassword(true);
    expect(service.mustResetPassword()).toBeTrue();

    service.setMustResetPassword(false);
    expect(service.mustResetPassword()).toBeFalse();
  });

  it('logout clears session and navigates to login', () => {
    service.setToken('jwt-token');
    localStorage.setItem('userInfo', JSON.stringify({ role: 'admin' }));

    service.logout();

    expect(localStorage.getItem('session_id')).toBeNull();
    expect(localStorage.getItem('userInfo')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(messageService.createMessage).toHaveBeenCalled();
  });

  it('login posts credentials to login-web', () => {
    service.login({ email: 'a@b.com', password: 'x' }).subscribe();

    const req = httpMock.expectOne(`${environment.base_url}/login-web`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'x' });
    req.flush({ access_token: 'tok', expires_in: 3600 });
  });
});
