import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'mustResetPassword',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('redirects to login when unauthenticated', () => {
    auth.isAuthenticated.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => AuthGuard());

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('redirects to force-reset when password must be reset', () => {
    auth.isAuthenticated.and.returnValue(true);
    auth.mustResetPassword.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => AuthGuard());

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/force-reset']);
  });

  it('allows access when authenticated and no forced reset', () => {
    auth.isAuthenticated.and.returnValue(true);
    auth.mustResetPassword.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => AuthGuard());

    expect(result).toBeTrue();
  });
});
