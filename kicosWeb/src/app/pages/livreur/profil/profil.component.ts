import { Component, inject } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { CommonModule } from '@angular/common';
import L from 'leaflet';
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
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
    });
    this.getInfolivreur();
  }

  profilLivreur: any;
  longitude: any;
  latitude: any;
  // infos profil livreur
  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/profile`).subscribe(
      (response: any) => {
        this.profilLivreur = response.data;
        this.latitude = parseFloat(this.profilLivreur?.livreur.latitude);
        this.longitude = parseFloat(this.profilLivreur?.livreur.longitude);


        console.log(this.latitude)
        console.log(this.longitude)

        console.log(this.profilLivreur);
        this.initMap();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
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
           window.location.reload();
        }
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
        this.messageService.createMessage('error', 'Une erreur est survenue lors de la modification du profil.');
      }
    );
  }

  modifierLivreur() {
    // Récupération des valeurs du formulaire
    const profilData = {
      latitude: (document.getElementById('latitude') as HTMLInputElement).value,
      longitude: (document.getElementById('longitude') as HTMLInputElement).value,
      estDisponible: (document.getElementById('availability') as HTMLInputElement).value,
    };

    // Appel à l'API pour modifier le profil du livreur
    this.apiService.postWithSessionId(`${this.baseUrl}/profile/livreur`, profilData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else {
          this.messageService.createMessage('success', response.message);
          // Rafraîchir les données du profil
          this.getInfolivreur();
           window.location.reload();
        }
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
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
           window.location.reload();
        }
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
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
           window.location.reload();
        }
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
        this.messageService.createMessage('error', 'Une erreur est survenue lors de la modification du profil.');
      }
    );

  }

  map: L.Map | undefined;

  initMap(): void {
    if (!this.latitude || !this.longitude) {
      console.error('Coordonnées invalides');
      return;
    }

    this.map = L.map('map').setView([this.latitude, this.longitude], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const marker = L.marker([this.latitude, this.longitude], {
      draggable: true
    }).addTo(this.map)
      .bindPopup('Déplacez-moi pour changer la position')
      .openPopup();

    // 🔁 Quand le marqueur est déplacé
    marker.on('dragend', (event: any) => {
      const position = marker.getLatLng();
      this.latitude = position.lat;
      this.longitude = position.lng;

      console.log('Nouvelle position :', this.latitude, this.longitude);

      marker.getPopup()?.setContent(
        `Nouvelle position :<br>Lat: ${this.latitude.toFixed(5)}, Lng: ${this.longitude.toFixed(5)}`
      ).openOn(this.map!);
    });
  }

  marker: L.Marker | undefined;
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;

          // Mise à jour de la vue de la carte
          if (this.map) {
            this.map.setView([this.latitude, this.longitude], 15);

            // Déplace le marqueur existant ou en crée un nouveau
            if (this.marker) {
              this.marker.setLatLng([this.latitude, this.longitude]);
            } else {
              this.marker = L.marker([this.latitude, this.longitude], { draggable: true }).addTo(this.map);
            }

            this.marker.bindPopup(`Ma position actuelle`).openPopup();
          }
        },
        (error) => {
          console.error('Erreur lors de la géolocalisation', error);
        }
      );
    } else {
      alert("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }


}
