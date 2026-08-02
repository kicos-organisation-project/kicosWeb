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

  moyenTransfertLabels: Record<string, string> = {
    orange_money: 'Orange Money',
    wave: 'Wave',
    free_money: 'Free Money',
    nita_transfert: 'Nita Transfert',
    bank: 'Banque',
  };

  ngOnInit(): void {
    this.getInfolivreur();
  }

  profilLivreur: any;

  avatarUrl(): string {
    const image = this.profilLivreur?.partenaire?.image_url;
    return safeImage(
      image ? `https://kiccos.terangacode.com/public/${image}` : null,
      DEFAULT_AVATAR
    );
  }

  getMoyenTransfertLabel(value: string | null | undefined): string {
    if (!value) return '—';
    return this.moyenTransfertLabels[value] || value;
  }

  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/profile`).subscribe(
      (response: any) => {
        this.profilLivreur = response.data;
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

  modifierInformationsRestaurant() {
    if (!this.selectedFile) {
      this.messageService.createMessage('error', 'Veuillez sélectionner une image');
      return;
    }

    const restaurantData = new FormData();
    restaurantData.append('image', this.selectedFile);
    restaurantData.append('nom_partenaire', (document.getElementById('nom_partenaire') as HTMLInputElement).value);
    restaurantData.append('localisation', (document.getElementById('localisation') as HTMLInputElement).value);
    restaurantData.append('description', (document.getElementById('description') as HTMLTextAreaElement).value);
    restaurantData.append('horaire', (document.getElementById('horaire') as HTMLInputElement).value);

    this.apiService.postWithSessionId(`${this.baseUrl}/profile/partenaire`, restaurantData).subscribe(
      (response: any) => {
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        }
        this.messageService.createMessage('success', 'Informations du restaurant mises à jour avec succès');
        this.getInfolivreur();
        window.location.reload();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error?.message || 'Erreur mise à jour établissement');
      }
    );
  }
}
