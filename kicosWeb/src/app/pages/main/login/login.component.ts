import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  loading = false;
  showPassword = false;
  loginForm!: FormGroup;

  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  messageService = inject(MessageService);

  ngOnInit() {
    if (this.authService.isAuthenticated() && this.authService.mustResetPassword()) {
      this.router.navigate(['/force-reset']);
      return;
    }
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.authService.getDefaultHomeRoute()]);
      return;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmitLoginForm() {
    if (!this.loginForm.valid) {
      this.messageService.createMessage('error', 'Veuillez remplir tous les champs');
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        this.loading = false;
        const { user, access_token, must_reset_password } = response;
        if (!access_token) {
          this.messageService.createMessage('error', 'Erreur de connexion');
          return;
        }

        this.authService.setToken(access_token);
        const userInfo = {
          ...user,
          must_reset_password: !!(must_reset_password || user?.must_reset_password),
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        this.loginForm.reset();

        if (userInfo.must_reset_password) {
          this.messageService.createMessage(
            'warning',
            'Réinitialisation obligatoire de votre mot de passe temporaire'
          );
          this.router.navigate(['/force-reset']);
          return;
        }

        this.router.navigate([this.authService.getDefaultHomeRoute()]);
        this.messageService.createMessage('success', 'Connexion réussie');
      },
      error: () => {
        this.loading = false;
        this.messageService.createMessage('error', 'Erreur de connexion');
      },
    });
  }
}
