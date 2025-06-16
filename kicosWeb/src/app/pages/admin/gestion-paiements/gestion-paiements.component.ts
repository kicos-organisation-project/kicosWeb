import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../core/services/message.service';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-gestion-paiements',
  standalone: true,
  imports: [TabViewModule, TableModule, FormsModule, DialogModule,CommonModule],
  templateUrl: './gestion-paiements.component.html',
  styleUrl: './gestion-paiements.component.css'
})
export class GestionPaiementsComponent {

  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  baseUrl = environment.base_url;
  demandeCommerce: any[] = [];
  demandeLivreur: any[] = [];
  demandes: any[] = [];

  ngOnInit() {
    this.listDemandePartenaire();
  }

  // lister les demandes de paiement des partenaires
  listDemandePartenaire() {
    // On fait appel a l'api pour lister les demande de paiement des  partenaires
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/admin/transactions`).subscribe(
      (response: any) => {
        console.log("liste des partenaires", response.data.data);
        this.demandes = response.data;
        this.demandeCommerce = this.demandes.filter(item => item.type === 'partner_request');
        this.demandeLivreur = this.demandes.filter(item => item.type === 'livreur_payment');
        console.log("liste des partenaires",  this.demandeCommerce );
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

  closeModal() {
    this.visible = false;
  }

  statusDemande:any;
  reference:any;

  idDemande:any;
  recupDemandeID(demande:any){
    this.idDemande = demande.id;
    this.statusDemande = demande.status;
  }

  resetvalueDemande(){
    this.statusDemande = '';
    this.reference = '';
  }

  // traiter demande paiements
  traiterDemandePaiement() {
    // On fait appel a l'api pour traiter les demande de paiement des  partenaires
    this.apiService.postWithSessionId(`${this.baseUrl}/solde/process-payout/${this.idDemande}`, { status: this.statusDemande, motif: this.reference}).subscribe(
      (response: any) => {
        console.log("Demande traitée", response);
        this.listDemandePartenaire();
        this.messageService.createMessage('success', response.message);
        this.resetvalueDemande();
        this.closeModal();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    )
  }



 

  filterTerm: string = "";
  searchText: string = "";
  filterliste: any[] = [];
  filterPaiement() {
    this.filterTerm = this.searchText;

    // Si le terme de recherche est vide, restaurer la liste complète
    if (!this.filterTerm || this.filterTerm.trim() === '') {
      this.listDemandePartenaire(); // Réinitialiser la liste
      return;
    }

    // Sinon, filtrer normalement
    this.filterliste = this.apiService.filterByTerm(
      this.demandeCommerce,
      this.filterTerm,
      ['status', 'montant', 'partenaire.nom_partenaire', 'partenaire.localisation']
    );

    if (this.filterliste.length === 0) {
      this.listDemandePartenaire();
    } else {
      this.demandeCommerce = this.filterliste;
    }
  }
  debounceTimer: any = null;

  // Appelez cette méthode depuis votre input
  onSearch() {
    // Annuler le timer existant
    clearTimeout(this.debounceTimer);

    // Créer un nouveau timer
    this.debounceTimer = setTimeout(() => {
      this.filterPaiement();
    }, 300);
  }

}
