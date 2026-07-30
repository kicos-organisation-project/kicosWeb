import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-force-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './force-reset.component.html',
  styleUrl: './force-reset.component.css',
})
export class ForceResetComponent implements OnInit {
  loading = false;
  resetForm!: FormGroup;

  private authService = inject(AuthService);
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private apiService = inject(ApiService);
  private baseUrl = environment.base_url;

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    if (!this.authService.mustResetPassword()) {
      this.router.navigate([this.authService.getDefaultHomeRoute()]);
      return;
    }

    this.resetForm = this.formBuilder.group({
      new_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/),
        ],
      ],
      new_password_confirmation: ['', Validators.required],
    });
  }

  onSubmitForceReset(): void {
    if (!this.resetForm.valid) {
      this.messageService.createMessage('error', 'Veuillez renseigner le nouveau mot de passe');
      return;
    }
    if (
      this.resetForm.value.new_password !==
      this.resetForm.value.new_password_confirmation
    ) {
      this.messageService.createMessage('error', 'Les mots de passe ne correspondent pas');
      return;
    }

    this.loading = true;
    this.apiService
      .postWithSessionId(`${this.baseUrl}/profile/force-password-reset`, this.resetForm.value)
      .subscribe({
        next: (response: any) => {
          this.loading = false;
          this.authService.setMustResetPassword(false);
          this.messageService.createMessage(
            'success',
            response.message || 'Mot de passe mis à jour'
          );
          this.router.navigate([this.authService.getDefaultHomeRoute()]);
        },
        error: (error: any) => {
          this.loading = false;
          this.messageService.createMessage(
            'error',
            error.error?.message || 'Erreur lors de la réinitialisation'
          );
        },
      });
  }
}
