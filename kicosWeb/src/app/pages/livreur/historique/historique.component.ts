import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule, PaginatorModule],
  templateUrl: './historique.component.html',
  styleUrl: './historique.component.css'
})
export class HistoriqueComponent {

  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Injection de dépendances
  apiService = inject(ApiService);
  messageService = inject(MessageService);

  ngOnInit(): void {
    this.getInfolivreur();
    // this.listeGains();
  }


  id_livreur: any;
  // infos profil livreur
  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${environment.base_url}/profile`).subscribe(
      (response: any) => {
        this.id_livreur = response.data.livreur.id;
        console.log(this.id_livreur);
        this.listehistoriquelivraisons();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }


  historiqueLivraisons: any;
  livraisonPending:any
  livraisonDelivered:any
  // Liste des historique-livraisons
  listehistoriquelivraisons() {
    // On fait appel a l'api pour lister les historique-livraisons
    this.apiService.getRequestWithSessionId(`${environment.base_url}/livreurs/${this.id_livreur}/historique-livraisons`).subscribe(
      (response: any) => {
        console.log("liste des historique livraisons", response.data);
        this.historiqueLivraisons = response.data;
        this.livraisonPending = this.historiqueLivraisons.filter((history:any)=>history.livraison_status === 'pending');
        this.livraisonDelivered = this.historiqueLivraisons.filter((history:any)=>history.livraison_status === 'delivered');
      },
      (error: any) => {
        console.log(error)
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

}
