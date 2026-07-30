import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const ForceResetGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (!auth.mustResetPassword()) {
    router.navigate([auth.getDefaultHomeRoute()]);
    return false;
  }

  return true;
};
