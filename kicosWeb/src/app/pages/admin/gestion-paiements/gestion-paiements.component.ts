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

  ngOnInit() {
    this.listDemandePartenaire();
  }

  // lister les demandes de paiement des partenaires
  listDemandePartenaire() {
    // On fait appel a l'api pour lister les demande de paiement des  partenaires
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/admin/demandes`).subscribe(
      (response: any) => {
        console.log("liste des partenaires", response.demandes);
        this.demandeCommerce = response.demandes;
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);

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
  motifPaiement:any;

  idDemande:any;
  recupDemandeID(demande:any){
    this.idDemande = demande.id;
    this.statusDemande = demande.status;
  }

  resetvalueDemande(){
    this.statusDemande = '';
    this.motifPaiement = '';
  }

  // traiter demande paiements
  traiterDemandePaiement() {
    // On fait appel a l'api pour traiter les demande de paiement des  partenaires
    this.apiService.postWithSessionId(`${this.baseUrl}/admin/demandes/${this.idDemande}/traiter`, { status: this.statusDemande, motif: this.motifPaiement}).subscribe(
      (response: any) => {
        console.log("Demande traitée", response);
        this.listDemandePartenaire();
        this.messageService.createMessage('success', response.message);
        this.resetvalueDemande();
        this.closeModal();
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    )
  }


  demandeLivreur = [
    {
      id: 1,
      photo: 'https://img.freepik.com/free-vector/young-afro-man-smiling_24877-81870.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Thomas Martin',
      statut: 'Employés',
      action: 'Modifier'
    },
    {
      id: 2,
      photo: 'https://img.freepik.com/free-vector/cute-girl-student-wearing-face-mask-cleansing-hands-with-hand-soap-protection-virus-covid19_40876-3285.jpg?t=st=1733949226~exp=1733952826~hmac=07a6ee7132dad8ec340939a6f9a12bf56d865c3c3a049b7062f9f337449088ca&w=740',
      nomComplet: 'Sophie Dubois',
      statut: 'Particuliers',
      action: 'Supprimer'
    },
    {
      id: 3,
      photo: 'https://img.freepik.com/free-vector/young-bearded-man_24877-82119.jpg?t=st=1733949040~exp=1733952640~hmac=991bed926bf4da7600ecdd7d64e469f0fd7b55729f2e33e35540e4d705b76da5&w=740',
      nomComplet: 'Pierre Durand',
      statut: 'Employés',
      action: 'Modifier'
    },
    {
      id: 4,
      photo: 'https://img.freepik.com/free-vector/woman-working-with-laptop-successful-cute-cartoon-character-doodle-style_40876-3220.jpg?t=st=1733949171~exp=1733952771~hmac=26f9d48dec6b4b4481a18705c916ceddda7513ea8686f0ec1c2680ff4b5cfe40&w=740',
      nomComplet: 'Marie Lambert',
      statut: 'Particuliers',
      action: 'Supprimer'
    },
    {
      id: 5,
      photo: 'https://img.freepik.com/free-vector/purple-man-with-blue-hair_24877-82003.jpg?t=st=1733949092~exp=1733952692~hmac=cad4495a499bec5b0cb70e544eae109ffbd918179491ccdee118475b85ae5008&w=740',
      nomComplet: 'Lucas Bernard',
      statut: 'Employés',
      action: 'Modifier'
    },
    {
      id: 6,
      photo: 'https://img.freepik.com/free-vector/cute-girl-student-wearing-face-mask-cleansing-hands-with-hand-soap-protection-virus-covid19_40876-3285.jpg?t=st=1733949226~exp=1733952826~hmac=07a6ee7132dad8ec340939a6f9a12bf56d865c3c3a049b7062f9f337449088ca&w=740',
      nomComplet: 'Emma Petit',
      statut: 'Particuliers',
      action: 'Supprimer'
    }
  ];

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
