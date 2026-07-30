import { Component, inject } from '@angular/core';

import { PaginatorModule } from 'primeng/paginator';

import { DialogModule } from 'primeng/dialog';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';

import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';

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

  router = inject(Router);

  route = inject(ActivatedRoute);

  http = inject(HttpClient);

  apiService = inject(ApiService);

  messageService = inject(MessageService);

  fb = inject(FormBuilder)

  

  baseUrl = environment.base_url;

  categorieTab: any[] = [];

  scope: 'admin' | 'partner' = 'admin';

  pageTitle = 'Gestion Catégories';

  partnerId: string | null = null;

  error: any = null;



  categorieForm = this.fb.group({

    titre: new FormControl('', Validators.required),

  });



  resetCategorieForm() {

    this.categorieForm.patchValue({ titre: '' });

    this.error = null;

  }



  ngOnInit(): void {

    this.scope = this.route.snapshot.data['scope'] || 'admin';

    this.pageTitle = this.scope === 'partner' ? 'Mes catégories' : 'Gestion Catégories';

    const userInfo = this.getUserInfo();

    // login-web renvoie l'objet partenaire comme `user` (id = partenaire_id)
    this.partnerId =
      userInfo?.partenaire?.id ??
      (userInfo?.role === 'partenaire' ? userInfo?.id : null) ??
      null;

    this.listeCategorie();

  }



  private getUserInfo(): any {

    try {

      return JSON.parse(localStorage.getItem('userInfo') || 'null');

    } catch {

      return null;

    }

  }



  ajouterCategorie() {

    if (this.categorieForm.invalid) {

      this.messageService.createMessage('error', 'Le nom de la catégorie est obligatoire');

      return;

    }



    this.apiService.postWithSessionId(`${this.baseUrl}/add-categorie`, this.categorieForm.value).subscribe(

      (response: any) => {

        if (response.status_code === 422) {

          this.error = response.errorList;

          this.messageService.createMessage('error', response.message);

          return;

        }

        this.resetCategorieForm();

        this.listeCategorie();

        this.messageService.createMessage('success', response.message);

      },

      (error: any) => {

        this.messageService.createMessage('error', error.error?.message || 'Erreur catégories');

      }

    );

  }



  listeCategorie() {

    this.apiService.getRequestWithSessionId(`${this.baseUrl}/mes-categories`).subscribe(

      (response: any) => {

        const items = Array.isArray(response) ? response : (response.categories || []);

        this.categorieTab = this.filterCategories(items);

      },

      (error: any) => {

        this.messageService.createMessage('error', error.error?.message || 'Erreur catégories');

      }

    );

  }



  private filterCategories(items: any[]): any[] {

    if (this.scope === 'admin') {

      return items.filter((item) => item.partenaire_id == null);

    }

    if (!this.partnerId) {

      return [];

    }

    return items.filter((item) => item.partenaire_id === this.partnerId);

  }



  canManage(categorie: any): boolean {

    if (this.scope === 'admin') {

      return categorie.partenaire_id == null;

    }

    return categorie.partenaire_id === this.partnerId;

  }



  CurrentCategorie: any;

  chargerInfosCategorie(paramCategorie: any) {

    this.CurrentCategorie = paramCategorie;

    this.categorieForm.patchValue({ titre: paramCategorie.titre });

  }



  isEditMode = false;



  toggleEditMode() {

    this.isEditMode = true;

  }



  onCancel() {

    this.isEditMode = false;

    this.resetCategorieForm();

  }



  updateCategorie() {

    this.apiService.putWithSessionId(`${this.baseUrl}/categories/${this.CurrentCategorie.id}`, this.categorieForm.value).subscribe(

      (response: any) => {

        this.isEditMode = false;

        this.resetCategorieForm();

        this.listeCategorie();

        this.messageService.createMessage('success', response.message);

      },

      (error: any) => {

        this.messageService.createMessage('error', error.error?.message || 'Erreur mise à jour');

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

        this.apiService.deleteWithSessionId(`${this.baseUrl}/categories/${categorieId}`).subscribe(

          (response: any) => {

            this.listeCategorie();

            Swal.fire({

              title: "Supprimé !",

              text: "La catégorie a été supprimée.",

              icon: "success"

            });

            this.messageService.createMessage('success', response.message);

          },

          (error: any) => {

            this.messageService.createMessage('error', error.error?.message || 'Erreur suppression');

          }

        );

      }

    });

  }

}

