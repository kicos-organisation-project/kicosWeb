import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../core/services/message.service';

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
 messageService = inject(MessageService);

  chartData: any;
  chartOptions: any;
  gaugeOptions: any;
  gaugeData: any;



  ngOnInit() {
    this.commandeList();
    this.paiementstat();
    this.getInfolivreur();
    this.listeArticle();
    
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
        this.messageService.createMessage('error', error.error.message);

      }
    )
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

  profilLivreur: any;
  // infos profil livreur
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

  // liste article 
  listeArticles: number=0;
  listeArticle() {
    this.apiService.get(`${this.baseUrl}/articles-partenaire`).subscribe(
      (response: any) => {
        this.listeArticles = response.length;
      },
      (error: any) => {
      }
    );
  }

}
