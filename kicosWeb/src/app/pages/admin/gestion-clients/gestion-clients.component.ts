import { Component, OnInit } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../core/services/message.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { TableModule } from 'primeng/table';
@Component({
  selector: 'app-gestion-clients',
  standalone: true,
  imports: [PaginatorModule, DialogModule, CommonModule, SkeletonModule, TableModule],
  templateUrl: './gestion-clients.component.html',
  styleUrl: './gestion-clients.component.css'
})
export class GestionClientsComponent {
  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  isLoading: boolean = true;

  // Declaration des variables 
  baseUrl = environment.base_url;
  ListeLivreur: any[] = [];
  detailLivreur: any;

  ngOnInit() {
    this.getLivreur();
  }

  // lister livreur
  getLivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/clients`).subscribe(
      (response: any) => {
        console.log(response.clients);
        this.ListeLivreur = response.clients;
        this.isLoading = false; // Désactivez le chargement une fois les données chargées

      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  // detail clients
  showClients(client_id: number) {
    this.apiService.get(`${this.baseUrl}/show-client/${client_id}`).subscribe(
      (response: any) => {
        this.detailLivreur = response;
        console.log("Detail du partenaire", this.detailLivreur);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }

  // contrôler la visibilité du modal detail client  
  visibleDetailLivreur: boolean = false;
  showDialogDetailLivreur() {
    this.visibleDetailLivreur = true;
  }

  filterTerm: string = "";
  searchText: string = "";
  filterliste: any[] = [];
  filterLivreur() {
    this.filterTerm = this.searchText;

    // Si le terme de recherche est vide, restaurer la liste complète
    if (!this.filterTerm || this.filterTerm.trim() === '') {
      this.getLivreur(); // Réinitialiser la liste
      return;
    }

    // Sinon, filtrer normalement
    this.filterliste = this.apiService.filterByTerm(
      this.ListeLivreur,
      this.filterTerm,
      ['user.firstName', 'user.lastName', 'etat', 'user.phoneNumber', 'user.email']
    );

    if (this.filterliste.length === 0) {
      this.getLivreur();
    } else {
      this.ListeLivreur = this.filterliste;
    }
  }
  debounceTimer: any;
  onSearch() {
    // Annuler le timer existant
    clearTimeout(this.debounceTimer);

    // Créer un nouveau timer
    this.debounceTimer = setTimeout(() => {
      this.filterLivreur();
    }, 300);
  }

}
