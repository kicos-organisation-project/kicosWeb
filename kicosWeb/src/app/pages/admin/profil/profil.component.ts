import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { CommonModule } from '@angular/common';

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

  ngOnInit(): void {

    this.getInfolivreur();

  }

  profilLivreur: any;
  // infos profil livreur
  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/profile`).subscribe(
      (response: any) => {
        this.profilLivreur = response.data;

        console.log(this.profilLivreur);
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  showPassword = false;
  // afficher mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  modifierProfilLivreur() {
    // Récupération des valeurs du formulaire
    const profilData = {
      firstName: (document.getElementById('firstName') as HTMLInputElement).value,
      lastName: (document.getElementById('lastName') as HTMLInputElement).value,
      email: (document.getElementById('email') as HTMLInputElement).value,
      phoneNumber: (document.getElementById('phoneNumber') as HTMLInputElement).value
    };

    // Appel à l'API pour modifier le profil du livreur
    this.apiService.postWithSessionId(`${this.baseUrl}/profile/basic-info`, profilData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else {
          this.messageService.createMessage('success', response.message);
          // Rafraîchir les données du profil
          this.getInfolivreur();
        }
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
        this.messageService.createMessage('error', 'Une erreur est survenue lors de la modification du profil.');
      }
    );
  }

  modifierPassword() {
    // Récupération des valeurs du formulaire
    const profilData = {
      current_password: (document.getElementById('current_password') as HTMLInputElement).value,
      new_password: (document.getElementById('new_password') as HTMLInputElement).value,
      new_password_confirmation: (document.getElementById('new_password_confirmation') as HTMLInputElement).value,
    };

    // Appel à l'API pour modifier le profil du livreur
    this.apiService.postWithSessionId(`${this.baseUrl}/profile/password`, profilData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else {
          this.messageService.createMessage('success', response.message);
          (document.getElementById('current_password') as HTMLInputElement).value = '';
          (document.getElementById('new_password') as HTMLInputElement).value = '';
          (document.getElementById('new_password_confirmation') as HTMLInputElement).value = '';
          this.getInfolivreur();
        }
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
        this.messageService.createMessage('error', 'Une erreur est survenue lors de la modification du mot de passe.');
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Vérification de la taille du fichier (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB en octets
      if (file.size > maxSize) {
        alert('La taille du fichier dépasse la limite de 5MB');
        return;
      }

      // Vérification du type de fichier
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        alert('Format de fichier non valide. Veuillez choisir un fichier JPG, PNG ou JPEG.');
        return;
      }

      this.selectedFile = file;
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) {
      alert('Veuillez sélectionner une image');
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.apiService.postWithSessionId(`${this.baseUrl}/profile/image`, formData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else {
          this.messageService.createMessage('success', response.message);
          this.getInfolivreur();
        }
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
        this.messageService.createMessage('error', 'Une erreur est survenue lors de la modification du profil.');
      }
    );

  }

  modifierInformationsAdmin() {
    // Récupération des valeurs du formulaire administratif
    const adminData = {
      avatar: (document.getElementById('avatar') as HTMLInputElement).value,
      address: (document.getElementById('address') as HTMLInputElement).value
    };
  
    // Appel à l'API pour modifier les informations administratives
    this.apiService.postWithSessionId(`${this.baseUrl}/profile/admin`, adminData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else {
          this.messageService.createMessage('success', 'Informations administratives mises à jour avec succès');
          // Rafraîchir les informations après la mise à jour
          this.getInfolivreur();
        }
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
        this.messageService.createMessage('error', 'Une erreur est survenue lors de la modification des informations administratives.');
      }
    );
  }


}
