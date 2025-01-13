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
      console.log("Vous etes connecté");
      return true;
    } else {
      router.navigate(['/login']);
      console.log("Vous n'etes pas connecté");
      return false;
    }
}
 
