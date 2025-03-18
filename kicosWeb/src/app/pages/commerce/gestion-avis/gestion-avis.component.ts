import { Component, inject } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gestion-avis',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule, PaginatorModule, RouterLink, RouterModule],
  templateUrl: './gestion-avis.component.html',
  styleUrl: './gestion-avis.component.css'
})
export class GestionAvisComponent {
  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // Injection de dépendances
  route = inject(ActivatedRoute);
  apiService = inject(ApiService);

  baseUrl = environment.base_url;


  detailArticle: any;
  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      // Récupérez les détails de l'article avec cet ID
      // On fait appel a l'api pour afficher les détails d'un partenaire
      this.apiService.getRequestWithSessionId(`${this.baseUrl}/articles/${id}`).subscribe(
        (response: any) => {
          this.detailArticle = response;
          console.log("Detail du articles", this.detailArticle);
        },
        (error: any) => {
          console.log("Partie erreur");
          console.log(error);

        }
      )
    });
  }
}
