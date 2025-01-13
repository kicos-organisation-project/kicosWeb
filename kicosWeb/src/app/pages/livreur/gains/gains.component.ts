import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { Component } from '@angular/core';

@Component({
  selector: 'app-gains',
  standalone: true,
  imports: [PaginatorModule,DialogModule],
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
}
