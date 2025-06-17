import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gains',
  standalone: true,
  imports: [PaginatorModule, DialogModule, CommonModule],
  templateUrl: './gains.component.html',
  styleUrl: './gains.component.css'
})
export class GainsComponent {
   cdr = inject(ChangeDetectorRef);

  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.cdr.detectChanges(); // Forcer la mise à jour de la vue
  }
  getPaginatedPartners(): any[] {
    return this.gaingainsApproveds.slice(this.first, this.first + this.rows);
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
        this.listeGains();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }


  gains: any;
  gaingainsApproveds: any;
  // Liste des gains
  listeGains() {
    console.log(this.id_livreur);
    // On fait appel a l'api pour lister les gains
    this.apiService.getRequestWithSessionId(`${environment.base_url}/livreurs/${this.id_livreur}/gains`).subscribe(
      (response: any) => {
        console.log("liste des gains", response.data);
        this.gains = response.data;
         this.gaingainsApproveds = this.gains.transactions
          .filter((transaction: any) => transaction.status === 'approved')
          .map((transaction: any) => ({
            ...transaction,
            livreur: {
              firstName: this.gains.livreur.user.firstName,
              lastName: this.gains.livreur.user.lastName,
              email: this.gains.livreur.user.email,
              phoneNumber: this.gains.livreur.user.phoneNumber
            }
          }));

        console.log(this.gaingainsApproveds);

      },
      (error: any) => {
        console.log(error)
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

}
