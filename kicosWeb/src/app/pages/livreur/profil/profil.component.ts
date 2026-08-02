import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { CommonModule } from '@angular/common';
import { safeImage, DEFAULT_AVATAR } from '../../../core/utils/image.util';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  baseUrl = environment.base_url;
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  selectedFile: File | null = null;
  DEFAULT_AVATAR = DEFAULT_AVATAR;

  ngOnInit(): void {
    this.getInfolivreur();
  }

  profilLivreur: any;
  latitude: any;
  longitude: any;

  avatarUrl(): string {
    const image = this.profilLivreur?.livreur?.image;
    return safeImage(
      image ? `https://kiccos.terangacode.com/public/${image}` : null,
      DEFAULT_AVATAR
    );
  }

  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/profile`).subscribe(
      (response: any) => {
        this.profilLivreur = response.data;
        this.latitude = parseFloat(this.profilLivreur?.livreur?.latitude);
        this.longitude = parseFloat(this.profilLivreur?.livreur?.longitude);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  showPassword = false;
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  modifierProfilLivreur() {
    const profilData = {
      firstName: (document.getElementById('firstName') as HTMLInputElement).value,
      lastName: (document.getElementById('lastName') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      phoneNumber: (document.getElementById('phoneNumber') as HTMLInputElement).value
    };

    this.apiService.postWithSessionId(`${this.baseUrl}/profile/basic-info`, profilData).subscribe(
      (response: any) => {
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        }
        this.messageService.createMessage('success', response.message);
        this.getInfolivreur();
        window.location.reload();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error?.message || 'Erreur modification profil');
      }
    );
  }

  modifierLivreur() {
    const profilData = {
      latitude: (document.getElementById('latitude') as HTMLInputElement).value,
      longitude: (document.getElementById('longitude') as HTMLInputElement).value,
      estDisponible: (document.getElementById('availability') as HTMLInputElement).value,
    };

    this.apiService.postWithSessionId(`${this.baseUrl}/profile/livreur`, profilData).subscribe(
      (response: any) => {
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        }
        this.messageService.createMessage('success', response.message);
        this.getInfolivreur();
        window.location.reload();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error?.message || 'Erreur modification livreur');
      }
    );
  }

  modifierPassword() {
    const profilData = {
      current_password: (document.getElementById('current_password') as HTMLInputElement).value,
      new_password: (document.getElementById('new_password') as HTMLInputElement).value,
      new_password_confirmation: (document.getElementById('new_password_confirmation') as HTMLInputElement).value,
    };

    this.apiService.postWithSessionId(`${this.baseUrl}/profile/password`, profilData).subscribe(
      (response: any) => {
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        }
        this.messageService.createMessage('success', response.message);
        this.getInfolivreur();
        window.location.reload();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error?.message || 'Erreur modification mot de passe');
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.messageService.createMessage('error', 'La taille du fichier dépasse la limite de 5MB');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        this.messageService.createMessage('error', 'Format de fichier non valide.');
        return;
      }
      this.selectedFile = file;
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      this.messageService.createMessage('error', 'Veuillez sélectionner une image');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.apiService.postWithSessionId(`${this.baseUrl}/profile/image`, formData).subscribe(
      (response: any) => {
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        }
        this.messageService.createMessage('success', response.message);
        this.getInfolivreur();
        window.location.reload();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error?.message || 'Erreur upload image');
      }
    );
  }

  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
        },
        (error) => {
          console.error('Erreur lors de la géolocalisation', error);
        }
      );
    } else {
      this.messageService.createMessage('error', 'La géolocalisation n\'est pas supportée par ce navigateur.');
    }
  }
}
