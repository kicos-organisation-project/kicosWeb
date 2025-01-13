import { Component, HostListener, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { ApiService } from '../../../../core/services/api.service';
// import { MessageService } from '../../../../core/services/message.service';
// import { LoaderService } from '../../../../core/services/loader.service';
import { inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
// import { PrimeModule } from '../../../../prime/prime.module';
// import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loading = false;
  boutiques: any[] = [];
  longitude: any;
  latitude: any;
  visibleBoutiques: boolean = false;
  showPassword = false;
  // form Variables
  loginForm!: FormGroup;

  // fermeture du modal sur clique en dehors
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Vérifiez si le clic a eu lieu en dehors du modal
    if (this.visibleBoutiques && !targetElement.closest('.ui-dialog')) {
      this.visibleBoutiques = false;
    }
  }

  // Injection de dépendances
  // authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  // messageService = inject(MessageService);
  // apiService = inject(ApiService);
  // loaderService = inject(LoaderService);


// tableau de trois utilisateur
 users = [
  {login: 'admin', password: 'admin123@', role: 'admin', nom: 'Diop', prenom: 'Moussa',profil:'https://attic.sh/atvxa8lu3yg4jk7hb8vidiogkyyi'},
  {login: 'commerce', password: 'commerce123@', role: 'commerce', nom: 'Ndiaye', prenom: 'Fatou',profil:'https://france-fraternites.org/wp-content/uploads/2017/07/o-EMOJI-570.jpg'},
  {login: 'livreur', password: 'livreur123@', role: 'livreur', nom: 'Sall', prenom: 'Ibrahima',profil:'https://attic.sh/7bs32pvmv7v4cyne6je5cty95cdp'}
];

  ngOnInit() {
    this.loginForm = this.createLoginForm();
    if (!localStorage.getItem("userConnected")) {
      localStorage.setItem("userConnected", JSON.stringify(""));
    }
  }

  // afficher mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // login form submit
  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // méthode login
  onSubmitLoginForm() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
    const user = this.users.find((u) => u.login === formData.login && u.password === formData.password);
    if (user) {
      if(user.role === 'admin') {
        this.router.navigate(['kicos/admin']);
      }else if(user.role === 'commerce'){
        this.router.navigate(['kicos/commerce']);
      }else{
        this.router.navigate(['kicos/livreur']);
      }
      
      localStorage.setItem('userConnected', JSON.stringify(user));
      // TODO: Afficher le dialogue boutique et réinitialiser le formulaire
    } else {
      console.error("Réponse d'authentification invalide");
      // TODO: Afficher un message d'erreur
    }
  }
}

}
