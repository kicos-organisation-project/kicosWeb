import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ForceResetGuard } from './force-reset.guard';
import { AuthService } from '../services/auth.service';

describe('ForceResetGuard', () => {
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'mustResetPassword',
      'getDefaultHomeRoute',
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

    const result = TestBed.runInInjectionContext(() => ForceResetGuard());

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('redirects home when reset already done', () => {
    auth.isAuthenticated.and.returnValue(true);
    auth.mustResetPassword.and.returnValue(false);
    auth.getDefaultHomeRoute.and.returnValue('/kicos/admin');

    const result = TestBed.runInInjectionContext(() => ForceResetGuard());

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/kicos/admin']);
  });

  it('allows force-reset page when reset is required', () => {
    auth.isAuthenticated.and.returnValue(true);
    auth.mustResetPassword.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => ForceResetGuard());

    expect(result).toBeTrue();
  });
});
