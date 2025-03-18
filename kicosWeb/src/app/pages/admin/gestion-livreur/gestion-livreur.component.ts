import { Component, HostListener, inject } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../core/services/api.service';
import { MessageService } from '../../../core/services/message.service';
import { ValidationOptions, ValidatorCore } from '../../../core/validators/validator';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface DeliveryPerformance {
  id: number;
  name: string;
  deliveriesCompleted: number;
  onTimeDeliveryRate: number;
  customerRating: number;
  status: 'active' | 'inactive';
  lastDelivery: Date;
}

@Component({
  selector: 'app-gestion-livreur',
  standalone: true,
  imports: [TabViewModule, TableModule, ChartModule, FormsModule, CommonModule, ReactiveFormsModule, DialogModule, FormsModule, CardModule, ButtonModule, InputTextModule, ProgressBarModule, RatingModule, TagModule,ToastModule],
  templateUrl: './gestion-livreur.component.html',
  styleUrl: './gestion-livreur.component.css'
})
export class GestionLivreurComponent {
  // Injection de dépendances
  router = inject(Router);
  http = inject(HttpClient);
  apiService = inject(ApiService);
  messageService = inject(MessageService);
  fb = inject(FormBuilder)

  date: Date[] | undefined;



  // Le formulaire ajout livreur
  LivreurForm = this.fb.group({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', [ValidatorCore.nameValidator("Le motif du depense ", 10, 100)]),
    password: new FormControl('', [
      ValidatorCore.passWordValidator('Le mot de passe', 8),
    ]),
    password_confirm: new FormControl('', [
      ValidatorCore.passWordValidator('Le mot de passe de confirmation', 8),
    ]),
    licence_driver_number: new FormControl('', [
      ValidatorCore.isValidAlphNumValidator("Le licence", 10, 10),
    ]),
    phoneNumber: new FormControl('', [
      ValidatorCore.nameValidator('Le numero de telephone', 10, 100),
    ]),
    email: new FormControl('', [
      ValidatorCore.nameValidator('L email', 10, 100),
    ]),
  });

  openMenuId: number | null = null;

  toggleMenu(event: Event, rowId: number) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === rowId ? null : rowId;
  }



  @HostListener('document:click')
  closeMenu() {
    this.openMenuId = null;
  }

  // Initialisation avec ngOnInit
  ngOnInit() {
    this.loadData();
    this.calculateStats();
    this.getLivreur();
    // Validation en temps réel pour chaque champ
    Object.keys(this.LivreurForm.controls).forEach((controlName) => {
      this.LivreurForm.get(controlName)?.valueChanges.subscribe(() => {
        this.validateField(controlName);
      });
    });
  }

  // Declaration des variables 
  baseUrl = environment.base_url;
  ListeLivreur: any[] = [];
  detailLivreur: any;

  // Valider un champ spécifique
  validateField(controlName: string) {
    const control = this.LivreurForm.get(controlName);
    if (control) {
      const value = control.value;
      let options: ValidationOptions = {};

      switch (controlName) {
        case 'firstName':
          options = { regex: /^[a-zA-Z]+$/, regexMessage: 'Le prénom ne doit contenir que des lettres.' };
          break;
        case 'lastName':
          options = { regex: /^[a-zA-Z]+$/, regexMessage: 'Le nom ne doit contenir que des lettres.' };
          break;
        case 'phoneNumber':
          options = { regex: /^\+\d{1,4}\d{7,14}$/, regexMessage: 'Le numéro de téléphone doit contenir exactement 13 chiffres.' };
          break;
        case 'licence_driver_number':
          options = { regex: /^[\p{L}\p{N}\s.,!?-]+$/u, regexMessage: 'La description contient des caractères non autorisés.' };
          break;
        case 'password':
          options = {
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            regexMessage: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
            required: true,
            requiredMessage: 'Le mot de passe est obligatoire.'
          };
          break;

        case 'password_confirm':
          options = {
            regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
            regexMessage: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.',
            required: true,
            requiredMessage: 'La confirmation du mot de passe est obligatoire.',
            match: 'password',
            matchMessage: 'Les mots de passe ne correspondent pas.'
          };
          break;
        case 'email':
          options = { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, regexMessage: 'Veuillez entrer une adresse email valide.' };
          break;
        // case 'image':
        //   options = { regex: /\.(jpg|jpeg|png|gif|bmp|webp)$/, regexMessage: 'Le fichier n\'est pas une image valide.' };
        //   break;
        default:
          options = { regex: /^[a-zA-Z0-9]+$/, regexMessage: 'Ce champ ne doit contenir que des lettres et ou des chiffres.' };
      }

      const result = ValidatorCore.verifInputFonction(value, controlName, options);
      console.log(`Validation for ${controlName}:`, result); // Debug log
      control.setErrors(result.isValid ? null : { invalid: true });
    }
  }

  error: any;
  // ajouter livreur
  addLivreur() {
    // Envoyer la requête POST avec FormData
    this.apiService.postWithSessionId(`${this.baseUrl}/livreur`, this.LivreurForm.value).subscribe(
      (response: any) => {
        console.log(response.status_code);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          this.error = response.errorList;
          return;
        } else
          this.resetLivreurForm();
        this.getLivreur();
        this.closeModal();
        this.messageService.createMessage('success', response.message);
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  // lister livreur
  getLivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/livreur`).subscribe(
      (response: any) => {
        console.log(response.livreurs);
        this.ListeLivreur = response.livreurs;
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  id_livreur: any;
  // charger les données du livreur
  chargerInfosLivreur(livreur: any) {
    this.id_livreur = livreur.id;
    console.log("Charger les informations du livreur", livreur.id);
    this.LivreurForm.patchValue({
      firstName: livreur.user.firstName,
      lastName: livreur.user.lastName,
      licence_driver_number: livreur.licence_driver_number,
      phoneNumber: livreur.user.phoneNumber,
      email: livreur.user.email,
    })
  }

  //modifier livreur
  updateLivreur() {
    this.apiService.postWithSessionId(`${this.baseUrl}/livreur/${this.id_livreur}`, this.LivreurForm.value).subscribe(
      (response: any) => {
        console.log(response);
        if (response.status_code === 422) {
          this.messageService.createMessage('error', response.message);
          return;
        } else
          this.resetLivreurForm();
        this.closeModal();
        this.getLivreur();
        this.messageService.createMessage('success', response.message);
      },
      (error: any) => {
        console.log("Partie erreur");
        console.log(error);
      }
    );
  }

  onAction(action: 'view' | 'edit' | 'delete', rowId: number) {
    // Implémentez vos actions ici
    switch (action) {
      case 'view':
        console.log(`Voir les détails de l'item ${rowId}`);
        // On fait appel a l'api pour afficher les détails d'un partenaire
        this.apiService.get(`${this.baseUrl}/livreur/${rowId}`).subscribe(
          (response: any) => {
            this.detailLivreur = response;
            console.log("Detail du partenaire", this.detailLivreur);
          },
          (error: any) => {
            console.log("Partie erreur");
            console.log(error);

          }
        )
        break;
      case 'edit':
        console.log(`Éditer l'item ${rowId}`);
        break;
      case 'delete':
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
            this.apiService.deleteWithSessionId(`${this.baseUrl}/livreur/${rowId}`).subscribe(
              (response: any) => {
                console.log("Partenaire supprimé", response);
                this.getLivreur();
                Swal.fire({
                  title: "Supprimé !",
                  text: "Le livreur a été supprimé.",
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
        break;
    }
    this.openMenuId = null; // Ferme le menu après l'action
  }


  // Méthode pour réinitialiser les champs du formulaire 
  resetLivreurForm() {
    this.LivreurForm.reset({
      firstName: '',
      lastName: '',
      password: '',
      licence_driver_number: '',
      phoneNumber: '',
      email: '',
    });
  }

  dataLivraison: any;
  optionsLivraison: any;
  chartDataLivreur: any;
  chartOptionsCategorie: any;



  showPassword = false;
  // afficher mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // contrôler la visibilité du modal ajout livreur
  visibleAddLivreur: boolean = false;
  showDialogAddLivreur() {
    console.log('helloooo!!!!')
    this.visibleAddLivreur = true;
    console.log('test')
  }
  // contrôler la visibilité du modal detail livreur  
  visibleDetailLivreur: boolean = false;
  showDialogDetailLivreur() {
    this.visibleDetailLivreur = true;
  }
  // contrôler la visibilité du modal modifier livreur
  visibleEditLivreur: boolean = false;
  showDialogEditLivreur() {
    this.visibleEditLivreur = true;
  }

  //fermer modal
  closeModal() {
    this.visibleAddLivreur = false;
    this.visibleEditLivreur = false;
  }


  drivers: DeliveryPerformance[] = [];
  selectedDriver: DeliveryPerformance | null = null;
  displayDialog: boolean = false;
  activeDrivers: number = 0;
  avgDeliveryRate: number = 0;
  avgRating: number = 0;

  loadData() {
    // Simuler le chargement des données
    this.drivers = [
      {
        id: 1,
        name: 'Jean Dupont',
        deliveriesCompleted: 150,
        onTimeDeliveryRate: 95,
        customerRating: 4.8,
        status: 'active',
        lastDelivery: new Date()
      },
      {
        id: 2,
        name: 'Marie Martin',
        deliveriesCompleted: 120,
        onTimeDeliveryRate: 88,
        customerRating: 4.5,
        status: 'active',
        lastDelivery: new Date()
      }
    ];
  }

  calculateStats() {
    const activeDrivers = this.drivers.filter(d => d.status === 'active');
    this.activeDrivers = activeDrivers.length;
    this.avgDeliveryRate = Math.round(
      activeDrivers.reduce((acc, curr) => acc + curr.onTimeDeliveryRate, 0) / activeDrivers.length
    );
    this.avgRating = Number(
      (activeDrivers.reduce((acc, curr) => acc + curr.customerRating, 0) / activeDrivers.length)
        .toFixed(1)
    );
  }

  hideDialog() {
    this.displayDialog = false;
    this.selectedDriver = null;
  }

}
