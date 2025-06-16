import { Component, inject } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-categorie',
  standalone: true,
  imports: [PaginatorModule, DialogModule, CommonModule, ReactiveFormsModule, FormsModule, RouterModule, TabViewModule,TableModule],
  templateUrl: './categorie.component.html',
  styleUrl: './categorie.component.css'
})
export class CategorieComponent {
  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder)
  
  baseUrl = environment.base_url;
  categorieTab: any[] = [];
  // Le formulaire ajout categorie
  categorieForm = this.fb.group({
    titre: new FormControl('', Validators.required),
  });

  // Méthode pour réinitialiser les champs du formulaire 
  resetCategorieForm() {
    this.categorieForm.patchValue({
      titre: '',
    });
  }

  ngOnInit(): void {
    this.listeCategorie();
  }

  // categorie
  ajouterCategorie() {
    // Envoyer la requête POST 
    this.apiService.postWithSessionId(`${this.baseUrl}/add-categorie`, this.categorieForm.value).subscribe(
      (response: any) => {
        console.log(response);
        this.resetCategorieForm();
        this.listeCategorie();
        this.messageService.createMessage('success', response.message);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }
  listeCategorie() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/all-categories`).subscribe(
      (response: any) => {
        this.categorieTab = response;
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }
  CurrentCategorie: any;
  chargerInfosCategorie(paramCategorie: any) {
    this.CurrentCategorie = paramCategorie;
    this.categorieForm.patchValue({
      titre: paramCategorie.titre
    })
  }

  isEditMode = false;

  toggleEditMode() {
    this.isEditMode = true;
  }

  onCancel() {
    this.isEditMode = false;
    this.resetCategorieForm()
  }

  updateCategorie() {
    this.apiService.putWithSessionId(`${this.baseUrl}/categories/${this.CurrentCategorie.id}`, this.categorieForm.value).subscribe(
      (response: any) => {
        console.log(response);
        this.resetCategorieForm();
        this.listeCategorie();
        this.messageService.createMessage('success', response.message);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  deleteCategorie(categorieId: any) {
    Swal.fire({
      title: "Êtes vous sûres?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprime-le !"
    }).then((result) => {
      if (result.isConfirmed) {
        // On fait appel a l'api pour supprimer un catégorie
        this.apiService.deleteWithSessionId(`${this.baseUrl}/categories/${categorieId}`).subscribe(
          (response: any) => {
            console.log("catégorie supprimé", response);
            this.listeCategorie();
            Swal.fire({
              title: "Supprimé !",
              text: "catégorie a été supprimé.",
              icon: "success"
            });
            this.messageService.createMessage('success', response.message);
            this.listeCategorie();
          },
          (error: any) => {
          this.messageService.createMessage('error', error.error.message);

          }
        )
      }
    });
  }
}
