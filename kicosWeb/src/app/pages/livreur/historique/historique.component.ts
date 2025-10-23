import { Component, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';
import { SkeletonModule } from 'primeng/skeleton';
@Component({
  selector: 'app-historique',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule, PaginatorModule, SkeletonModule],
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

  isLoading: boolean = true; // Par défaut, le chargement est actif


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

  historiqueLivraisonsOriginal: any[] = [];
  historiqueLivraisons: any;
  livraisonPending: any
  livraisonDelivered: any
  // Liste des historique-livraisons
  listehistoriquelivraisons() {
    // On fait appel a l'api pour lister les historique-livraisons
    this.apiService.getRequestWithSessionId(`${environment.base_url}/livreurs/${this.id_livreur}/historique-livraisons`).subscribe(
      (response: any) => {
        console.log("liste des historique livraisons", response.data);
        this.historiqueLivraisons = response.data;
        this.historiqueLivraisonsOriginal = [...response.data];
        this.livraisonPending = this.historiqueLivraisons.filter((history: any) => history.livraison_status === 'pending');
        this.livraisonDelivered = this.historiqueLivraisons.filter((history: any) => history.livraison_status === 'delivered');
        this.isLoading = false; // Désactivez le chargement une fois les données chargées

      },
      (error: any) => {
        console.log(error)
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  filterTerm: string = "";
  searchText: string = "";
  filterliste: any[] = [];
  filterPartenaire() {
    this.filterTerm = this.searchText.trim();

    if (!this.filterTerm) {
      // Si recherche vide, on montre tout
      this.historiqueLivraisons = [...this.historiqueLivraisonsOriginal];
    } else {
      // Sinon on filtre sur la liste originale
      this.historiqueLivraisons = this.apiService.filterByTerm(
        this.historiqueLivraisonsOriginal, // Toujours filtrer sur la liste complète
        this.filterTerm,
        ['livraison_price', 'livraison_status']
      );
    }

    this.first = 0; // On retourne à la première page
  }
  debounceTimer: any = null;

  // Appelez cette méthode depuis votre input
  onSearch() {
    // Annuler le timer existant
    clearTimeout(this.debounceTimer);

    // Créer un nouveau timer
    this.debounceTimer = setTimeout(() => {
      this.filterPartenaire();
    }, 300);
  }

}
