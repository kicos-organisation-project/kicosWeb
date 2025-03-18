import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { ValidationOptions, ValidatorCore } from '../../../core/validators/validator';

@Component({
  selector: 'app-gestion-articles',
  standalone: true,
  imports: [PaginatorModule, DialogModule, CommonModule, ReactiveFormsModule, FormsModule, RouterLink, RouterModule, TabViewModule, TableModule],
  templateUrl: './gestion-articles.component.html',
  styleUrl: './gestion-articles.component.css'
})
export class GestionArticlesComponent {
  // les varaibles utilisees
  first: number = 0;
  rows: number = 8;
  baseUrl = environment.base_url;
  categorieTab: any[] = [];

  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.cdr.detectChanges(); // Forcer la mise à jour de la vue
  }
  getPaginatedPartners(): any[] {
    return this.listeArticles.slice(this.first, this.first + this.rows);
  }
  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  // contrôler la visibilité du modal ajout article
  visibleAddArticle: boolean = false;
  showDialogAddArticle() {
    this.visibleAddArticle = true;
  }

  id_article: any
  // contrôler la visibilité du modal modification article
  visibleUpdateArticle: boolean = false;
  showDialogUpdateArticle(article: any) {
    this.visibleUpdateArticle = true;
    this.articleForm.patchValue(article);
    this.id_article = article.id;
  }
  //fermer modal
  closeModal() {
    this.visibleAddArticle = false;
    this.visibleUpdateArticle = false;
    this.resetArticleForm
  }


  ngOnInit(): void {
    this.listeCategorie();
    this.listeArticle();
    // Validation en temps réel pour chaque champ
    Object.keys(this.articleForm.controls).forEach((controlName) => {
      this.articleForm.get(controlName)?.valueChanges.subscribe(() => {
        this.validateField(controlName);
      });
    });
  }



  // Le formulaire ajout article
  articleForm = this.fb.group({
    articleImage: new FormControl(''),
    articleName: new FormControl('', Validators.required),
    articleDescription: new FormControl('', Validators.required),
    articlePrice: new FormControl('', Validators.required),
    categorie_id: new FormControl('', Validators.required),
  });

  // Méthode pour réinitialiser les champs du formulaire
  resetArticleForm() {
    this.articleForm.patchValue({
      articleImage: '',
      articleName: '',
      articleDescription: '',
      articlePrice: '',
      categorie_id: '',
    });
  }


  listeCategorie() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/all-categories`).subscribe(
      (response: any) => {
        this.categorieTab = response;
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  photo_article: any
  // photo boutique
  addPhotoArticle(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.photo_article = fileInput.files[0];
      console.log(this.photo_article)
    }
  }

  validateField(controlName: string) {
    const control = this.articleForm.get(controlName);
    if (control) {
      const value = control.value;
      let options: ValidationOptions = {};

      switch (controlName) {
        case 'articleName':
          options = {
            regex: /^[\p{L}\p{N}\s.,!?-]{2,50}$/u,
            regexMessage: 'Le nom de l\'article doit contenir entre 2 et 50 caractères alphanumériques.',
            required: true,
            requiredMessage: 'Le nom de l\'article est obligatoire.'
          };
          break;

        case 'articleDescription':
          options = {
            regex: /^[\p{L}\p{N}\s.,!?-]{10,500}$/u,
            regexMessage: 'La description doit contenir entre 10 et 500 caractères.',
            required: true,
            requiredMessage: 'La description est obligatoire.'
          };
          break;

        case 'articlePrice':
          options = {
            regex: /^\d+(\.\d{1,2})?$/,
            regexMessage: 'Le prix doit être un nombre positif avec maximum 2 décimales.',
            required: true,
            requiredMessage: 'Le prix est obligatoire.'
          };
          break;

        case 'categorie_id':
          options = {
            regex: /^[\p{L}\p{N}\s.,!?-]{2,50}$/u,
            regexMessage: 'Veuillez sélectionner une catégorie valide.',
            required: true,
            requiredMessage: 'La catégorie est obligatoire.'
          };
          break;

        case 'articleImage':
          options = {
            regex: /\.(jpg|jpeg|png|gif|webp)$/i,
            regexMessage: 'Le fichier doit être une image (JPG, JPEG, PNG, GIF ou WEBP).'
          };
          break;

        default:
          options = {
            regex: /^[\p{L}\p{N}\s.,!?-]+$/u,
            regexMessage: 'Ce champ contient des caractères non autorisés.'
          };
      }

      const result = ValidatorCore.verifInputFonction(value, controlName, options);
      console.log(`Validation for ${controlName}:`, result); // Debug log
      control.setErrors(result.isValid ? null : { invalid: true });
    }
  }

  error: any;
  // ajout article
  ajouterArticle() {
    const formData = new FormData();

    // Ajouter chaque champ du formulaire explicitement
    formData.append('articleName', this.articleForm.value.articleName || '');
    formData.append('articlePrice', this.articleForm.value.articlePrice || '');
    formData.append('articleDescription', this.articleForm.value.articleDescription || '');
    formData.append('categorie_id', this.articleForm.value.categorie_id || '');

    // Ajouter le fichier image s'il existe
    if (this.photo_article) {
      formData.append('articleImage', this.photo_article);
    }
    // Envoyer la requête POST 
    this.apiService.postWithSessionId(`${this.baseUrl}/add-article`, formData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          this.error = response.errorList;
          return;
        } else
          this.resetArticleForm();
        this.closeModal();
        this.listeArticle();
        this.messageService.createMessage('success', response.message);
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  // liste article 
  listeArticles: any[] = [];
  listeArticle() {
    this.apiService.get(`${this.baseUrl}/articles-partenaire`).subscribe(
      (response: any) => {
        this.listeArticles = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  // modifier article 
  modifierArticle() {
    const formData = new FormData();
    // Ajouter chaque champ du formulaire explicitement
    formData.append('articleName', this.articleForm.value.articleName || '');
    formData.append('articlePrice', this.articleForm.value.articlePrice || '');
    formData.append('articleDescription', this.articleForm.value.articleDescription || '');
    formData.append('categorie_id', this.articleForm.value.categorie_id || '');

    // Ajouter le fichier image s'il existe
    if (this.photo_article) {
      formData.append('articleImage', this.photo_article);
    }
    // On fait appel a l'api pour modifier les partenaires
    this.apiService.postWithSessionId(`${this.baseUrl}/articles/${this.id_article}`, formData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          this.error = response.errorList;
          return;
        } else
          this.closeModal();
        this.messageService.createMessage('success', response.message);
        this.listeArticle();
        this.resetArticleForm();

      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);

      }
    )
  }

  // supprimer articles
  suprimerArticle(idArticle: string) {
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
        // On fait appel a l'api pour supprimer un partenaire
        this.apiService.deleteWithSessionId(`${this.baseUrl}/articles/${idArticle}`).subscribe(
          (response: any) => {
            console.log("article supprimé", response);
            this.listeArticle();
            Swal.fire({
              title: "Supprimé !",
              text: "Le article a été supprimé.",
              icon: "success"
            });
            this.messageService.createMessage('success', response.message);
          },
          (error: any) => {
            console.log("Partie erreur");
            console.log(error);

          }
        )
      }
    });
  }

}



