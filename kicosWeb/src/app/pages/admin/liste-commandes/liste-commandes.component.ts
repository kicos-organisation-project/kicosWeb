import { Component, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-liste-commandes',
  standalone: true,
  imports: [TableModule, DialogModule],
  templateUrl: './liste-commandes.component.html',
  styleUrl: './liste-commandes.component.css'
})
export class ListeCommandesComponent {

  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);


  // Declaration des variables 
  baseUrl = environment.base_url;
  first: number = 0;
  rows: number = 6;
  tabCommande: any[] = [];

  ngOnInit() {
    this.commandeList();
  }

  // lister les partenaire
  commandeList() {
    // On fait appel a l'api pour lister les commandes
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/commandes`).subscribe(
      (response: any) => {
        console.log("liste des commandes", response);
        this.tabCommande = response.data;
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

  detailcommande:any;
  // détail partenaire
  detailCommande(idCommande: string) {
    // On fait appel a l'api pour afficher les détails d'un partenaire
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/commandes/${idCommande}`).subscribe(
      (response: any) => {
        this.detailcommande = response.data;
        console.log("Detail du commande", this.detailcommande);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }


}
