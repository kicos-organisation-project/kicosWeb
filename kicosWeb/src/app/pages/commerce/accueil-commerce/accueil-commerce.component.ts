import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-accueil-commerce',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './accueil-commerce.component.html',
  styleUrl: './accueil-commerce.component.css'
})
export class AccueilCommerceComponent {

  apiService = inject(ApiService);
  baseUrl = environment.base_url;


  chartData: any;
  chartOptions: any;
  gaugeOptions: any;
  gaugeData: any;



  ngOnInit() {
    this.initChart();
    this.initGaugeChart();
    this.commandeList();
    this.paiementstat();
    this.getInfolivreur();
    
  }

  private initChart() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Evolution des ventes',
          data: [265, 359, 480, 156, 490, 788, 287],
          backgroundColor: '#F97316',
          borderRadius: 8,
          barPercentage: 0.4,

        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            display: false
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

  nombreTotalCommande: number = 0;
  nombreCommandesPending: number = 0;
  nombreCommandescancelled: number = 0;
  nombreCommandesconfirmed: number = 0;
  nombreCommandesprocessing: number = 0;
  nombreCommandesshipped: number = 0;
  // lister les commandes
  commandeList() {
    // On fait appel a l'api pour lister les commandes
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/commandes/partenaire`).subscribe(
      (response: any) => {
        console.log("liste des commandes", response);
        this.nombreTotalCommande = response.data.length;
        let commandesPending = response.data.filter((commande: any) => commande.status === "pending");
        this.nombreCommandesPending = commandesPending.length;
        let commandescancelled = response.data.filter((commande: any) => commande.status === "cancelled");
        this.nombreCommandescancelled = commandescancelled.length;
        let commandesconfirmed = response.data.filter((commande: any) => commande.status === "confirmed");
        this.nombreCommandesconfirmed = commandesconfirmed.length;
        let commandesprocessing = response.data.filter((commande: any) => commande.status === "processing");
        this.nombreCommandesprocessing = commandesprocessing.length;
        let commandesshipped = response.data.filter((commande: any) => commande.status === "shipped");
        this.nombreCommandesshipped = commandesshipped.length;

      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);

      }
    )
  }

  statPayement: any;
  paiementstat() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaire/payments/stats`).subscribe(
      (response: any) => {
        this.statPayement = response.data;
        console.log(this.statPayement);
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
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

  // liste article 
  listeArticles: any[] = [];
  listeArticle() {
    this.apiService.get(`${this.baseUrl}/articles-partenaire`).subscribe(
      (response: any) => {
        this.listeArticles = response.length;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

}
