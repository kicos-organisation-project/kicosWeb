import { Component } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-gestion-articles',
  standalone: true,
  imports: [PaginatorModule,DialogModule,CommonModule,ReactiveFormsModule,FormsModule,RouterLink,RouterModule],
  templateUrl: './gestion-articles.component.html',
  styleUrl: './gestion-articles.component.css'
})
export class GestionArticlesComponent {
  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

 
   // contrôler la visibilité du modal ajout article
   visibleAddArticle: boolean = false;
   showDialogAddArticle() {
     this.visibleAddArticle = true;
   }

   //fermer modal
   closeModal() {
     this.visibleAddArticle = false;
   }

}
