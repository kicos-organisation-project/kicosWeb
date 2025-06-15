import { Component, inject } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../../../core/services/message.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-gestion-paiements',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule, PaginatorModule, RouterModule, ReactiveFormsModule, TooltipModule],
  templateUrl: './gestion-paiements.component.html',
  styleUrl: './gestion-paiements.component.css'
})
export class GestionPaiementsComponent {

  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);

  demandesPaiement: any[] = [];

  // Le formulaire ajout article
  demandeForm = this.fb.group({
    amount: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required),

  });


  // Méthode pour réinitialiser les champs du formulaire
  resetDemandeForm() {
    this.demandeForm.patchValue({
      amount: '',
      note: '',
    });
  }

  ngOnInit(): void {
    this.listeDemandePaiement();
  }

  // Liste des demandes de paiement
  listeDemandePaiement() {
    // On fait appel a l'api pour lister les demandes de paiement
    this.apiService.getRequestWithSessionId(`${environment.base_url}/demandes/mes-demandes`).subscribe(
      (response: any) => {
        console.log("liste des demandes de paiement", response);
        this.demandesPaiement = response.demandes;
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  // Méthode pour ajouter une demande de paiement
  addDemandePaiement() {
    // On récupère les données du formulaire
    const { amount, note } = this.demandeForm.value;

    // On fait appel a l'api pour ajouter une demande de paiement
    this.apiService.postWithSessionId(`${environment.base_url}/solde/request-payout`, { amount, note }).subscribe(
      (response: any) => {
        console.log("Demande de paiement ajoutée", response);
        this.messageService.createMessage('success', response.message);
        this.resetDemandeForm();
        this.listeDemandePaiement();
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
         this.messageService.createMessage('error', error.error.message);
      }
    );
  }
  
}
