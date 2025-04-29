import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-accueil-admin',
  standalone: true,
  imports: [ChartModule, RouterModule, CommonModule],
  templateUrl: './accueil-admin.component.html',
  styleUrl: './accueil-admin.component.css'
})
export class AccueilAdminComponent {


  apiService = inject(ApiService);
  baseUrl = environment.base_url;

  dataCategogrie: any;
  optionsCategogrie: any;
  dataVentes: any;
  optionsVentes: any;
  userInfo: any;
  userRole: any;
  deliveryZoneData: any;
  deliveryZoneOptions: any;
  selectedMonth = 'Jan';


  // Initialisation avec ngOnInit
  ngOnInit() {
    this.initializeChartDataCategorie();
    this.listPartenaire();
    this.getLivreur();
    this.getClient();
  }

  // Données Paiement recu par mois
  initializeChartDataCategorie(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );

    this.dataCategogrie = {
      labels: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
      datasets: [
        {
          label: 'Paiement reçu par mois',
          backgroundColor: documentStyle.getPropertyValue('--bg-primary'),
          borderColor: documentStyle.getPropertyValue('--bg-primary'),
          data: [400, 500, 350, 420, 560, 290, 340, 310, 280, 390, 350, 420],
          barThickness: 15,
          borderRadius: 5
        },
      ],
    };

    this.optionsCategogrie = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
          },
          categoryPercentage: 0.2,
          barPercentage: 0.3,
        },
        y: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
            stepSize: 10,
            beginAtZero: true,
            max: 100,
          },
          grid: {
            display: false,
          },
        },
      },
    };
  }


  nombrePartenaire:number=0;
  // lister les partenaire
  listPartenaire() {
    // On fait appel a l'api pour lister les partenaires
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires`).subscribe(
      (response: any) => {
        this.nombrePartenaire = response.partenaires.length;
      },
      (error: any) => {


      }
    )
  }

  nombreLivreur:number=0;
    // lister livreur
    getLivreur() {
      this.apiService.getRequestWithSessionId(`${this.baseUrl}/livreur`).subscribe(
        (response: any) => {
          this.nombreLivreur = response.livreurs.length;
        },
        (error: any) => {

        }
      );
    }

    nombreClient:number=0;
    getClient() {
      this.apiService.getRequestWithSessionId(`${this.baseUrl}/clients`).subscribe(
        (response: any) => {
          this.nombreClient = response.clients.length;
        },
        (error: any) => {

        }
      );
    }
}
