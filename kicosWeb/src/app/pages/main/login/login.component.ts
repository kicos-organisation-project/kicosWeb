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
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';
import { ApiService } from '../../../core/services/api.service';
import { LoaderService } from '../../../core/services/loader.service';
// import { PrimeModule } from '../../../../prime/prime.module';
// import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
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



  // Injection de dépendances
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);
  apiService = inject(ApiService);
  loaderService = inject(LoaderService);



  ngOnInit() {
    this.loginForm = this.createLoginForm();
    if (!localStorage.getItem("userInfo")) {
      localStorage.setItem("userInfo", JSON.stringify(""));
    }
  }

  // afficher mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // login form submit
  createLoginForm(): FormGroup {
    return this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  // méthode login
  onSubmitLoginForm() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.authService.login(formData).subscribe(
        (response: any) => {
          console.log('response', response);

          const { user, access_token } =
            response;
          console.log(response);

          // Vérifiez si la réponse contient toutes les informations nécessaires
          if (access_token) {
            // console.log('tokenStore', access_token);

            // Stocker le jeton et la durée d'expiration
            this.authService.setToken(access_token);

            // Stocker les informations utilisateur
            localStorage.setItem('userInfo', JSON.stringify(user));
            this.loginForm.reset();
            if (response.user.role === 'admin') {
              this.router.navigate(['kicos/admin']);
            } else if (response.user.role === 'partenaire') {
              this.router.navigate(['kicos/commerce']);
            } else {
              this.router.navigate(['kicos/livreur']);
            }
            this.messageService.createMessage(
              'success',
              'Connexion réussie avec succés'
            );
          } else {
            console.error("Réponse d'authentification invalide");
            this.messageService.createMessage('error', 'Erreur de connexion');
          }
        },
        (error) => {
          console.log('Erreur de connexion: ', error);
          this.messageService.createMessage('error', 'Erreur de connexion');
        }
      );
    } else {
      this.messageService.createMessage(
        'error',
        'Veuillez remplir tous les champs'
      );
    }
  }

}
