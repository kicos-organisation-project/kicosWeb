import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';


export const AuthGuard = () => {
  
    // injection du service d'authentification
    const auth = inject(AuthService);
  
    // injection du service de navigation
    const router = inject(Router);
  
  
    // définition du guard
     if (auth.isAuthenticated()) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
}
 
