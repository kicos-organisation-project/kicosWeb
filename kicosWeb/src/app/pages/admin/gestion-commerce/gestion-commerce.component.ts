import { Component } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-gestion-commerce',
  standalone: true,
  imports: [PaginatorModule,DialogModule,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './gestion-commerce.component.html',
  styleUrl: './gestion-commerce.component.css'
})
export class GestionCommerceComponent {

  listeBoutique: any[] = [];
  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  // contrôler la visibilité du modal details commerce
  visible: boolean = false;
  showDialogDetailCommerce() {
    this.visible = true;
  }

  // contrôler la visibilité du modal ajout commerce
  visibleAddCommerce: boolean = false;
  showDialogAddCommerce() {
    this.visibleAddCommerce = true;
  }

  //fermer modal
  closeModal() {
    this.visible = false;
    this.visibleAddCommerce = false;
  }

  showPassword = false;
  // afficher mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
