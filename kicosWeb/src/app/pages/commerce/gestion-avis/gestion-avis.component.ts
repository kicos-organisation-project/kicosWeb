import { Component } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gestion-avis',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule,PaginatorModule,RouterLink,RouterModule],
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
}
