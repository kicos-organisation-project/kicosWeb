import { Component, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { RouterLink, RouterModule } from '@angular/router';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-accueil-admin',
  standalone: true,
  imports: [ChartModule, CommonModule, RouterLink, RouterModule],
  templateUrl: './accueil-admin.component.html',
  styleUrl: './accueil-admin.component.css'
})
export class AccueilAdminComponent {


  apiService = inject(ApiService);
  baseUrl = environment.base_url;
 messageService = inject(MessageService);
  dataCategogrie: any;
  optionsCategogrie: any;
  dataVentes: any;
  optionsVentes: any;
  userInfo: any;
  userRole: any;
  deliveryZoneData: any;
  deliveryZoneOptions: any;
  selectedMonth = 'Jan';


  // Initialisation avec ngOnInit
  ngOnInit() {
    this.listPartenaire();
    this.getLivreur();
    this.getClient();
    this.getInfolivreur();
    this.listeCategorie();
    // this.paiementstat();
  }

  nombrePartenaire: number = 0;
  // lister les partenaire
  listPartenaire() {
    // On fait appel a l'api pour lister les partenaires
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires`).subscribe(
      (response: any) => {
        this.nombrePartenaire = response.partenaires.length;
      },
      (error: any) => {


      }
    )
  }

  nombreLivreur: number = 0;
  // lister livreur
  getLivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/livreur`).subscribe(
      (response: any) => {
        this.nombreLivreur = response.livreurs.length;
      },
      (error: any) => {

      }
    );
  }

  nombreClient: number = 0;
  getClient() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/clients`).subscribe(
      (response: any) => {
        this.nombreClient = response.clients.length;
      },
      (error: any) => {

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
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }
  categorieTab: any[] = [];
  listeCategorie() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/all-categories`).subscribe(
      (response: any) => {
        this.categorieTab = response.length;
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  statPayement:any;
  paiementstat() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/admin/payments/stats`).subscribe(
      (response: any) => {
        this.statPayement = response.data;
        console.log(this.statPayement);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }
}
