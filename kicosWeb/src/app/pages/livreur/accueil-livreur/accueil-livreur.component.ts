import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-accueil-livreur',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './accueil-livreur.component.html',
  styleUrl: './accueil-livreur.component.css'
})

export class AccueilLivreurComponent implements OnInit {
  gaugeData: any;
  gaugeOptions: any;
  lineData: any;
  lineOptions: any;
  barData: any;
  barOptions: any;
  selectedPeriod = '12 Mois';


  http = inject(HttpClient);
  apiService = inject(ApiService);
  baseUrl = environment.base_url;
  messageService = inject(MessageService);
  ngOnInit() {
    this.initGaugeChart();
    this.initLineChart();
    this.getInfolivreur();
    this.paiementstat();
    // this.get_actual_localisation();
  }


  longitude: any;
  latitude: any;
  retryCount = 0;
  maxRetries = 3; // Nombre maximum de tentatives

  updateLocation(latitude: number, longitude: number): Observable<any> {
    return this.http.post('https://kiccos.terangacode.com/api/livreurs/update-location', {
      latitude,
      longitude
    });
  }

  // Méthode principale pour obtenir la géolocalisation
  get_actual_localisation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.longitude = position.coords.longitude;
          this.latitude = position.coords.latitude;
          this.updateLocation(this.latitude, this.longitude).subscribe({
            next: () => console.log('Position mise à jour avec succès'),
            error: (error: any) => console.error('Erreur lors de la mise à jour de la position', error)
          });
        },
        (error) => {
          console.error('Erreur de géolocalisation :', error);
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            setTimeout(() => this.get_actual_localisation(), 5000); // Réessaye après 5 secondes
          } else {
            console.error('Échec après plusieurs tentatives. Utilisation du fallback.');
          }
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 30000
        }
      );
    } else {
      console.error('La géolocalisation n’est pas supportée par ce navigateur.');
    }
  }


  private initGaugeChart() {
    this.gaugeData = {
      datasets: [{
        data: [75],
        backgroundColor: ['#00BCD4'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      }]
    };

    this.gaugeOptions = {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      cutout: '85%',
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private initLineChart() {
    this.lineData = {
      labels: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Livraisons',
        data: [250, 200, 300, 350, 400, 450, 500, 550, 600, 550, 500, 450],
        borderColor: '#00BCD4',
        tension: 0.4,
        fill: false,
        pointRadius: 0
      }]
    };

    this.lineOptions = {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1000,
          ticks: {
            stepSize: 200
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  // Statistiques
  totalEarningsToday: any
  totalEarningsWeek: any;


  profilLivreur: any;
  id_livreur: any;
  // infos profil livreur
  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/profile`).subscribe(
      (response: any) => {
        this.id_livreur = response.data.livreur.id;
        this.listehistoriquelivraisons();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  statPayement: any;
  paiementstat() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/user/earnings`).subscribe(
      (response: any) => {
        this.statPayement = response.data;
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }


  historiqueLivraisons: any;
  livraisonPending: any
  livraisonDelivered: any
  // Liste des historique-livraisons
  listehistoriquelivraisons() {
    // On fait appel a l'api pour lister les historique-livraisons
    this.apiService.getRequestWithSessionId(`${environment.base_url}/livreurs/${this.id_livreur}/historique-livraisons`).subscribe(
      (response: any) => {
        this.historiqueLivraisons = response.data;
        this.livraisonPending = this.historiqueLivraisons.filter((history: any) => history.livraison_status === 'pending');
        this.totalEarningsToday = this.livraisonPending.length;
        this.livraisonDelivered = this.historiqueLivraisons.filter((history: any) => history.livraison_status === 'delivered');
        this.totalEarningsWeek = this.livraisonDelivered.length;

      },
      (error: any) => {

        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

}
