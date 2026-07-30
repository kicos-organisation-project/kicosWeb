import { Component, inject } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-gestion-avis',
  standalone: true,
  imports: [CommonModule, TabViewModule, TableModule, DialogModule, PaginatorModule, RouterLink, RouterModule],
  templateUrl: './gestion-avis.component.html',
  styleUrl: './gestion-avis.component.css'
})
export class GestionAvisComponent {
  first: number = 0;
  rows: number = 6;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  route = inject(ActivatedRoute);
  apiService = inject(ApiService);

  baseUrl = environment.base_url;
  detailArticle: any;
  articleKpis: any = null;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadArticleDetail(id);
      this.loadArticleStats(id);
    });
  }

  loadArticleDetail(id: string) {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/articles/${id}`).subscribe(
      (response: any) => {
        this.detailArticle = response.article || response;
      },
      () => {
        this.detailArticle = null;
      }
    );
  }

  loadArticleStats(id: string) {
    this.articleKpis = null;
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/articles/${id}/stats`).subscribe(
      (response: any) => {
        this.articleKpis = response.kpis;
      },
      () => {
        this.articleKpis = null;
      }
    );
  }
}
