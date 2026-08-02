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
import { safeImage, DEFAULT_PRODUCT } from '../../../core/utils/image.util';


@Component({
  selector: 'app-gestion-commerce',
  standalone: true,
  imports: [PaginatorModule, DialogModule, CommonModule, ReactiveFormsModule, FormsModule, SkeletonModule],
  templateUrl: './gestion-commerce.component.html',
  styleUrl: './gestion-commerce.component.css'
})
export class GestionCommerceComponent implements OnInit {

  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder)
  cdr = inject(ChangeDetectorRef);

  baseUrl = environment.base_url;
  listePartenaire: any[] = [];
  DetailPartenaire: any;
  isLoading: boolean = true;

  safeImage = safeImage;
  DEFAULT_PRODUCT = DEFAULT_PRODUCT;

  moyenTransfertOptions = [
    { value: 'orange_money', label: 'Orange Money' },
    { value: 'wave', label: 'Wave' },
    { value: 'free_money', label: 'Free Money' },
    { value: 'nita_transfert', label: 'Nita Transfert' },
    { value: 'bank', label: 'Banque' },
  ];

  moyenTransfertLabels: Record<string, string> = Object.fromEntries(
    this.moyenTransfertOptions.map((o) => [o.value, o.label])
  );

  first: number = 0;
  rows: number = 3;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.cdr.detectChanges();
  }

  getPaginatedPartners(): any[] {
    return this.listePartenaire.slice(this.first, this.first + this.rows);
  }

  partnerImageUrl(image: string | null | undefined): string {
    return safeImage(
      image ? `https://kiccos.terangacode.com/public/${image}` : null,
      DEFAULT_PRODUCT
    );
  }

  getMoyenTransfertLabel(value: string | null | undefined): string {
    if (!value) return '—';
    return this.moyenTransfertLabels[value] || value;
  }

  ngOnInit() {
    this.listPartenaire();
    Object.keys(this.PaternaireForm.controls).forEach((controlName) => {
      this.PaternaireForm.get(controlName)?.valueChanges.subscribe(() => {
        this.validateField(controlName);
      });
    });
  }

  visible: boolean = false;
  showDialogDetailCommerce() {
    this.visible = true;
  }

  visibleAddCommerce: boolean = false;
  showDialogAddCommerce() {
    this.visibleAddCommerce = true;
  }

  id_partenaire: any
  visibleUpdateCommerce: boolean = false;
  showDialogUpdateCommerce(partenaire: any) {
    this.visibleUpdateCommerce = true;
    this.PaternaireForm.patchValue({
      firstName: partenaire.user.firstName,
      lastName: partenaire.user.lastName,
      phoneNumber: partenaire.user.phoneNumber,
      email: partenaire.user.email,
      localisation: partenaire.localisation,
      situation: partenaire.situation,
      maps_url: partenaire.maps_url,
      moyen_transfert: partenaire.moyen_transfert,
      description: partenaire.description,
      ninea: partenaire.ninea,
      horaire: partenaire.horaire,
      type: partenaire.type === 'restaurant' ? 'resto' : partenaire.type,
      image: partenaire.image,
      nom_partenaire: partenaire.nom_partenaire,
      etat: partenaire.etat,
    });
    this.id_partenaire = partenaire.id;
  }

  closeModal() {
    this.visible = false;
    this.visibleAddCommerce = false;
    this.visibleUpdateCommerce = false
    this.resetFormPartenaire();
  }

  onDialogHide() {
    this.resetFormPartenaire();
  }

  PaternaireForm = this.fb.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    nom_partenaire: new FormControl('', Validators.required),
    type: new FormControl('', Validators.required),
    ninea: new FormControl(''),
    situation: new FormControl('', Validators.required),
    localisation: new FormControl('', Validators.required),
    maps_url: new FormControl(''),
    moyen_transfert: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    horaire: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email]),
    phoneNumber: new FormControl('', Validators.required),
    image: new FormControl(''),
    etat: new FormControl(''),
  });

  partnerTypes = [
    { value: 'boutique', label: 'Boutique' },
    { value: 'resto', label: 'Resto' },
    { value: 'immo', label: 'Immo' },
    { value: 'location', label: 'Location' },
  ];

  partenaireKpis: any = null;

  photo_etablissement: any
  addPhotoEtablissement(event: any) {
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      this.photo_etablissement = fileInput.files[0];
    }
  }

  resetFormPartenaire() {
    this.PaternaireForm.patchValue({
      firstName: '',
      lastName: '',
      localisation: '',
      situation: '',
      maps_url: '',
      moyen_transfert: '',
      horaire: '',
      ninea: '',
      description: '',
      phoneNumber: '',
      email: '',
      nom_partenaire: '',
      type: '',
      image: ''
    });
    this.partenaireKpis = null;
    this.PaternaireForm.markAsPristine();
    this.PaternaireForm.markAsUntouched();

    Object.keys(this.PaternaireForm.controls).forEach(key => {
      const control = this.PaternaireForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
      control?.setErrors(null);
    });

    this.error = null;
  }

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
          if (!value) {
            control.setErrors(null);
            return;
          }
          options = { regex: /^\d+$/, regexMessage: 'Le NINEA ne doit contenir que des chiffres.' };
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
        case 'situation':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'La situation contient des caractères non autorisés.' };
          break;
        case 'maps_url':
          if (!value) {
            control.setErrors(null);
            return;
          }
          options = { regex: /^https?:\/\/.+/i, regexMessage: 'URL Google Maps invalide.' };
          break;
        case 'moyen_transfert':
          options = { regex: /^(orange_money|wave|free_money|nita_transfert|bank)$/, regexMessage: 'Moyen de transfert invalide.' };
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
      control.setErrors(result.isValid ? null : { invalid: true });
    }
  }

  error: any;
  addPartenaire() {
    const formData = new FormData();

    formData.append('firstName', this.PaternaireForm.value.firstName || '');
    formData.append('lastName', this.PaternaireForm.value.lastName || '');
    formData.append('nom_partenaire', this.PaternaireForm.value.nom_partenaire || '');
    formData.append('type', this.PaternaireForm.value.type || '');
    formData.append('situation', this.PaternaireForm.value.situation || '');
    formData.append('localisation', this.PaternaireForm.value.localisation || '');
    formData.append('maps_url', this.PaternaireForm.value.maps_url || '');
    formData.append('moyen_transfert', this.PaternaireForm.value.moyen_transfert || '');
    formData.append('email', this.PaternaireForm.value.email || '');
    formData.append('phoneNumber', this.PaternaireForm.value.phoneNumber || '');
    formData.append('description', this.PaternaireForm.value.description || '');
    formData.append('horaire', this.PaternaireForm.value.horaire || '');
    if (this.PaternaireForm.value.ninea) {
      formData.append('ninea', this.PaternaireForm.value.ninea);
    }

    if (this.photo_etablissement) {
      formData.append('image', this.photo_etablissement);
    }

    this.apiService.postWithSessionId(`${this.baseUrl}/partenaires`, formData).subscribe(
      (response: any) => {
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
  listPartenaire() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires`).subscribe(
      (response: any) => {
        this.listePartenaire = response.partenaires;
        this.listePartenaireOriginal = [...response.partenaires];
        this.isLoading = false;
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    )
  }

  detailPatenaire(idPartenaire: string) {
    this.partenaireKpis = null;
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires/${idPartenaire}`).subscribe(
      (response: any) => {
        this.DetailPartenaire = response;
        this.loadPartenaireKpis(idPartenaire);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  loadPartenaireKpis(idPartenaire: string) {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/partenaires/${idPartenaire}/stats`).subscribe(
      (response: any) => {
        this.partenaireKpis = response.kpis;
      },
      () => {
        this.partenaireKpis = null;
      }
    );
  }

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
        this.apiService.deleteWithSessionId(`${this.baseUrl}/partenaires/${idPartenaire}`).subscribe(
          (response: any) => {
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

  modifierPartenaire() {
    this.apiService.postWithSessionId(`${this.baseUrl}/partenaires/${this.id_partenaire}`, this.PaternaireForm.value).subscribe(
      (response: any) => {
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
      this.listePartenaire = [...this.listePartenaireOriginal];
    } else {
      this.listePartenaire = this.apiService.filterByTerm(
        this.listePartenaireOriginal,
        this.filterTerm,
        ['nom_partenaire', 'type', 'localisation']
      );
    }

    this.first = 0;
  }
  debounceTimer: any = null;

  onSearch() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.filterPartenaire();
    }, 300);
  }
}
