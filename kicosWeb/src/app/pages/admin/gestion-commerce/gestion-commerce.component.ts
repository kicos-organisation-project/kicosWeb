import { Component, OnInit } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ValidationOptions, ValidatorCore } from '../../../core/validators/validator';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { MessageService } from '../../../core/services/message.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-gestion-commerce',
  standalone: true,
  imports: [PaginatorModule, DialogModule, CommonModule, ReactiveFormsModule, FormsModule, SkeletonModule],
  templateUrl: './gestion-commerce.component.html',
  styleUrl: './gestion-commerce.component.css'
})
export class GestionCommerceComponent implements OnInit {

  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder)
  cdr = inject(ChangeDetectorRef);

  // Declaration des variables 
  baseUrl = environment.base_url;
  listePartenaire: any[] = [];
  DetailPartenaire: any;
  isLoading: boolean = true; // Par défaut, le chargement est actif

  // les varaibles utilisees
  first: number = 0;
  rows: number = 3;

  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.cdr.detectChanges(); // Forcer la mise à jour de la vue
  }

  getPaginatedPartners(): any[] {
    return this.listePartenaire.slice(this.first, this.first + this.rows);
  }

  ngOnInit() {
    this.listPartenaire();
    // Validation en temps réel pour chaque champ
    Object.keys(this.PaternaireForm.controls).forEach((controlName) => {
      this.PaternaireForm.get(controlName)?.valueChanges.subscribe(() => {
        this.validateField(controlName);
      });
    });
  }

  // contrôler la visibilité du modal details partenaire
  visible: boolean = false;
  showDialogDetailCommerce() {
    this.visible = true;
  }

  // contrôler la visibilité du modal ajout partenaire
  visibleAddCommerce: boolean = false;
  showDialogAddCommerce() {
    this.visibleAddCommerce = true;
  }

  id_partenaire: any
  // contrôler la visibilité du modal modification partenaire
  visibleUpdateCommerce: boolean = false;
  showDialogUpdateCommerce(partenaire: any) {
    console.log(partenaire);
    this.visibleUpdateCommerce = true;
    this.PaternaireForm.patchValue({
      firstName: partenaire.user.firstName,
      lastName: partenaire.user.lastName,
      phoneNumber: partenaire.user.phoneNumber,
      email: partenaire.user.email,
      localisation: partenaire.localisation,
      description: partenaire.description,
      ninea: partenaire.ninea,
      horaire: partenaire.horaire,
      type: partenaire.type,
      image: partenaire.image,
      nom_partenaire: partenaire.nom_partenaire,
      etat: partenaire.etat,
    });
    this.id_partenaire = partenaire.id;
  }

  //fermer modal
  closeModal() {
    this.visible = false;
    this.visibleAddCommerce = false;
    this.visibleUpdateCommerce = false
    this.resetFormPartenaire();
  }

  onDialogHide() {
    this.resetFormPartenaire();
  }


  // Le formulaire ajout partenaire
  PaternaireForm = this.fb.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', [ValidatorCore.nameValidator("Le nom  ", 10, 100)]),
    nom_partenaire: new FormControl('', [ValidatorCore.nameValidator("Le nom  ", 10, 100)]),
    type: new FormControl('', [ValidatorCore.nameValidator("Le type  ", 10, 100)]),
    ninea: new FormControl('', [
      ValidatorCore.isValidAlphNumValidator("Le NINEA", 10, 10),
      Validators.pattern(/^[0-9]{7}$/)
    ]),
    localisation: new FormControl('', [
      ValidatorCore.isValidAdress("L'adresse de la boutique", 5, 40),
    ]),
    description: new FormControl('', [
      ValidatorCore.nameValidator('La description', 10, 100),
    ]),
    horaire: new FormControl('', [
      ValidatorCore.isValidAlphNumValidator("Les heures d'ouverture", 5, 5),
      Validators.required
    ]),

    email: new FormControl('', [
      ValidatorCore.nameValidator('L email', 10, 100),
    ]),
    phoneNumber: new FormControl('', [
      ValidatorCore.nameValidator('Le numero de telephone', 12, 100),
      Validators.pattern(/^[0-9]{12}$/)
    ]),

    image: new FormControl(''),
    etat: new FormControl(''),
  }

  );

  photo_etablissement: any
  // photo boutique
  addPhotoEtablissement(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.photo_etablissement = fileInput.files[0];
      console.log(this.photo_etablissement)
    }
  }

  // Méthode pour réinitialiser les champs du formulaire 
  resetFormPartenaire() {
    this.PaternaireForm.patchValue({
      firstName: '',
      lastName: '',
      localisation: '',
      horaire: '',
      ninea: '',
      description: '',
      phoneNumber: '',
      email: '',
      nom_partenaire: '',
      type: '',
      image: ''
    });
    // Réinitialiser les états de validation
    this.PaternaireForm.markAsPristine();
    this.PaternaireForm.markAsUntouched();

    // Réinitialiser chaque contrôle individuellement
    Object.keys(this.PaternaireForm.controls).forEach(key => {
      const control = this.PaternaireForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.setErrors(null);
    });

    // Réinitialiser les erreurs personnalisées
    this.error = null;
  }


  // Valider un champ spécifique
  validateField(controlName: string) {
    const control = this.PaternaireForm.get(controlName);
    if (control) {
      const value = control.value;
      let options: ValidationOptions = {};

      switch (controlName) {
        case 'firstName':
          options = { regex: /^[a-zA-ZÀ-ÖØ-öø-ÿ]+([ -][a-zA-ZÀ-ÖØ-öø-ÿ]+)*\s*$/, regexMessage: 'Le prénom ne doit contenir que des lettres.' };
          break;
        case 'lastName':
          options = { regex: /^[a-zA-ZÀ-ÖØ-öø-ÿ]+([ -][a-zA-ZÀ-ÖØ-öø-ÿ]+)*\s*$/, regexMessage: 'Le nom ne doit contenir que des lettres.' };
          break;
        case 'nom_partenaire':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'Le nom du partenaire contient des caractères non autorisés.' };
          break;
        case 'type':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'Le type du partenaire contient des caractères non autorisés.' };
          break;
        case 'ninea':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'Le NINEA doit contenir exactement 7 chiffres.' };
          break;
        case 'phoneNumber':
          options = { regex: /^\+\d{1,4}\d{7,14}$/, regexMessage: 'Le numéro de téléphone doit contenir exactement 13 chiffres.' };
          break;
        case 'horaire':
          options = { regex: /^(0?[0-9]|1[0-9]|2[0-3])h-(0?[0-9]|1[0-9]|2[0-3])h$/, regexMessage: 'Le format de l\'horaire est invalide (ex: 08:00 - 18:00).' };
          break;
        case 'description':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'La description contient des caractères non autorisés.' };
          break;
        case 'localisation':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'La localisation contient des caractères non autorisés.' };
          break;
        case 'email':
          options = { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, regexMessage: 'Veuillez entrer une adresse email valide.' };
          break;
        case 'image':
          options = { regex: /\.(jpg|jpeg|png|gif|bmp|webp)$/, regexMessage: 'Le fichier n\'est pas une image valide.' };
          break;
        default:
          options = { regex: /^[a-zA-Z0-9]+$/, regexMessage: 'Ce champ ne doit contenir que des lettres et ou des chiffres.' };
      }

      const result = ValidatorCore.verifInputFonction(value, controlName, options);
      console.log(`Validation for ${controlName}:`, result); // Debug log
      control.setErrors(result.isValid ? null : { invalid: true });
    }
  }

  error: any;
  // Ajouter un partenaire 
  addPartenaire() {
    const formData = new FormData();

    // Ajouter chaque champ du formulaire explicitement
    formData.append('firstName', this.PaternaireForm.value.firstName || '');
    formData.append('lastName', this.PaternaireForm.value.lastName || '');
    formData.append('nom_partenaire', this.PaternaireForm.value.nom_partenaire || '');
    formData.append('type', this.PaternaireForm.value.type || '');
    formData.append('localisation', this.PaternaireForm.value.localisation || '');
    formData.append('email', this.PaternaireForm.value.email || '');
    formData.append('phoneNumber', this.PaternaireForm.value.phoneNumber || '');
    formData.append('description', this.PaternaireForm.value.description || '');
    formData.append('horaire', this.PaternaireForm.value.horaire || '');
    formData.append('ninea', this.PaternaireForm.value.ninea || '');

    // Ajouter le fichier image s'il existe
    if (this.photo_etablissement) {
      formData.append('image', this.photo_etablissement);
    }

    // Envoyer la requête POST avec FormData
    this.apiService.postWithSessionId(`${this.baseUrl}/partenaires`, formData).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          this.error = response.errorList;
          return;
        } else
          this.resetFormPartenaire();
        this.closeModal();
        this.listPartenaire();
        this.messageService.createMessage('success', response.message);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  listePartenaireOriginal: any[] = [];
  // lister les partenaire
  listPartenaire() {
    // On fait appel a l'api pour lister les partenaires
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires`).subscribe(
      (response: any) => {
        console.log("liste des partenaires", response);
        this.listePartenaire = response.partenaires;
        this.listePartenaireOriginal = [...response.partenaires];
        this.isLoading = false; // Désactivez le chargement une fois les données chargées
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }

  // détail partenaire
  detailPatenaire(idPartenaire: string) {
    // On fait appel a l'api pour afficher les détails d'un partenaire
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires/${idPartenaire}`).subscribe(
      (response: any) => {
        this.DetailPartenaire = response;
        console.log("Detail du partenaire", this.DetailPartenaire);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }

  // supprimer partenaire
  suprimerPartenaire(idPartenaire: string) {
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
        this.apiService.deleteWithSessionId(`${this.baseUrl}/partenaires/${idPartenaire}`).subscribe(
          (response: any) => {
            console.log("Partenaire supprimé", response);
            this.listPartenaire();
            Swal.fire({
              title: "Supprimé !",
              text: "Le partenaire a été supprimé.",
              icon: "success"
            });
            this.messageService.createMessage('success', response.message);
          },
          (error: any) => {
            this.messageService.createMessage('error', error.error.message);

          }
        )
      }
    });
  }

  // modifier un partenaire
  modifierPartenaire() {
    // On fait appel a l'api pour modifier les partenaires
    this.apiService.postWithSessionId(`${this.baseUrl}/admin/partenaires/${this.id_partenaire}/update`, this.PaternaireForm.value).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else
          this.closeModal();
        this.messageService.createMessage('success', response.message);
        this.listPartenaire();
        this.resetFormPartenaire();
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);

      }
    )
  }

  filterTerm: string = "";
  searchText: string = "";
  filterliste: any[] = [];
  filterPartenaire() {
    this.filterTerm = this.searchText.trim();

    if (!this.filterTerm) {
      // Si recherche vide, on montre tout
      this.listePartenaire = [...this.listePartenaireOriginal];
    } else {
      // Sinon on filtre sur la liste originale
      this.listePartenaire = this.apiService.filterByTerm(
        this.listePartenaireOriginal, // Toujours filtrer sur la liste complète
        this.filterTerm,
        ['nom_partenaire', 'type', 'localisation']
      );
    }

    this.first = 0; // On retourne à la première page
  }
  debounceTimer: any = null;

  // Appelez cette méthode depuis votre input
  onSearch() {
    // Annuler le timer existant
    clearTimeout(this.debounceTimer);

    // Créer un nouveau timer
    this.debounceTimer = setTimeout(() => {
      this.filterPartenaire();
    }, 300);
  }
}