import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-gestion-commandes',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule, PaginatorModule, CommonModule, SkeletonModule],
  templateUrl: './gestion-commandes.component.html',
  styleUrl: './gestion-commandes.component.css'
})
export class GestionCommandesComponent {

  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);


  // Declaration des variables 
  baseUrl = environment.base_url;
  first: number = 0;
  rows: number = 6;
  listecommandes: any[] = [];
  isLoading: boolean = true; // Par défaut, le chargement est actif


  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }


  ngOnInit() {
    this.commandeList();
  }

  // lister les commandes
  commandeList() {
    // On fait appel a l'api pour lister les commandes
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/commandes/partenaire`).subscribe(
      (response: any) => {
        console.log("liste des commandes", response);
        this.listecommandes = response.data;
        this.isLoading = false; // Désactivez le chargement une fois les données chargées

      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  detailcommande: any;
  articletab: any[] = [];
  // détail partenaire
  detailCommande(idCommande: string) {
    // On fait appel a l'api pour afficher les détails d'un partenaire
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/commandes/${idCommande}`).subscribe(
      (response: any) => {
        this.detailcommande = response.data;
        this.articletab = this.detailcommande.panier.articles
        console.log("Detail du commande", this.detailcommande);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }
}
