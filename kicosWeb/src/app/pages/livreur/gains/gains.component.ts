import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { Component, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gains',
  standalone: true,
  imports: [PaginatorModule, DialogModule],
  templateUrl: './gains.component.html',
  styleUrl: './gains.component.css'
})
export class GainsComponent {
  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
  // contrôler la visibilité du modal details articles
  visible: boolean = false;
  showDialogDetailArticle() {
    this.visible = true;
  }
  // Injection de dépendances
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  userInfo: any;
  userid:any
  ngOnInit(): void {
     const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      this.userInfo = JSON.parse(storedUserInfo);
      this.userid = this.userInfo.id
    }
    this.listeGains();
  }



  gains: any;

  // Liste des demandes de paiement
  listeGains() {
    // On fait appel a l'api pour lister les demandes de paiement
    this.apiService.getRequestWithSessionId(`${environment.base_url}/livreurs/${this.userid}/gains`).subscribe(
      (response: any) => {
        console.log("liste des gains", response);
        this.gains = response;
      },
      (error: any) => {
        console.log(error)
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

}
