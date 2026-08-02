import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

describe('LoginComponent (integration)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    localStorage.clear();
    auth = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'mustResetPassword',
      'login',
      'setToken',
      'getDefaultHomeRoute',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);
    messageService = jasmine.createSpyObj('MessageService', ['createMessage']);

    auth.isAuthenticated.and.returnValue(false);
    auth.mustResetPassword.and.returnValue(false);
    auth.getDefaultHomeRoute.and.returnValue('/kicos/admin');

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
        { provide: MessageService, useValue: messageService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: {}, params: of({}), queryParams: of({}) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('shows error when form is invalid', () => {
    component.onSubmitLoginForm();
    expect(messageService.createMessage).toHaveBeenCalledWith(
      'error',
      'Veuillez remplir tous les champs'
    );
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('stores token and redirects home on success', fakeAsync(() => {
    auth.login.and.returnValue(
      of({
        access_token: 'tok',
        must_reset_password: false,
        user: { role: 'admin', email: 'a@b.com' },
      }) as any
    );

    component.loginForm.setValue({ email: 'a@b.com', password: 'Secret1!' });
    component.onSubmitLoginForm();
    tick();

    expect(auth.setToken).toHaveBeenCalledWith('tok');
    expect(JSON.parse(localStorage.getItem('userInfo')!).role).toBe('admin');
    expect(router.navigate).toHaveBeenCalledWith(['/kicos/admin']);
    expect(messageService.createMessage).toHaveBeenCalledWith('success', 'Connexion réussie');
  }));

  it('redirects to force-reset when must_reset_password is true', fakeAsync(() => {
    auth.login.and.returnValue(
      of({
        access_token: 'tok',
        must_reset_password: true,
        user: { role: 'partenaire' },
      }) as any
    );

    component.loginForm.setValue({ email: 'p@b.com', password: 'Secret1!' });
    component.onSubmitLoginForm();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/force-reset']);
  }));

  it('shows error message on login failure', fakeAsync(() => {
    auth.login.and.returnValue(throwError(() => new Error('fail')));

    component.loginForm.setValue({ email: 'a@b.com', password: 'bad' });
    component.onSubmitLoginForm();
    tick();

    expect(component.loading).toBeFalse();
    expect(messageService.createMessage).toHaveBeenCalledWith('error', 'Erreur de connexion');
  }));
});
