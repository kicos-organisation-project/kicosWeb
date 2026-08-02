import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../core/services/message.service';

@Component({
  selector: 'app-gestion-paiements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-paiements.component.html',
  styleUrl: './gestion-paiements.component.css'
})
export class GestionPaiementsComponent {
  apiService = inject(ApiService);
  messageService = inject(MessageService);

  solde: any = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadSolde();
  }

  loadSolde() {
    this.isLoading = true;
    this.apiService.getRequestWithSessionId(`${environment.base_url}/solde`).subscribe(
      (response: any) => {
        this.solde = response.solde;
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        this.messageService.createMessage('error', error.error?.message || 'Impossible de charger le solde');
      }
    );
  }
}
