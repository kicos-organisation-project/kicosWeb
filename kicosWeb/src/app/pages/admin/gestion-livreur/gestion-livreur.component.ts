import { Component, HostListener } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';



@Component({
  selector: 'app-gestion-livreur',
  standalone: true,
  imports: [TabViewModule, TableModule, ChartModule, FormsModule, CommonModule, ReactiveFormsModule, DialogModule,],
  templateUrl: './gestion-livreur.component.html',
  styleUrl: './gestion-livreur.component.css'
})
export class GestionLivreurComponent {
  date: Date[] | undefined;

  tabLivreur = [
    {
      id: 1,
      photo: 'https://img.freepik.com/free-vector/young-man-with-glasses-illustration_1308-174706.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Jean Dupont',
      telephone: '06 12 34 56 78',
      adresse: '15 rue de la Paix, Paris',
      etat: 'Actif',

    },
    {
      id: 2,
      photo: 'https://img.freepik.com/free-psd/3d-render-avatar-character_23-2150611759.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Marie Martin',
      telephone: '07 23 45 67 89',
      adresse: '8 avenue des Champs-Élysées, Paris',
      etat: 'Inactif',

    },
    {
      id: 3,
      photo: 'https://img.freepik.com/free-psd/3d-illustration-person-with-glasses_23-2149436190.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Pierre Bernard',
      telephone: '06 34 56 78 90',
      adresse: '25 rue Victor Hugo, Lyon',
      etat: 'En attente',

    },
    {
      id: 4,
      photo: 'https://img.freepik.com/free-psd/3d-rendering-hair-style-avatar-design_23-2151869127.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Sophie Dubois',
      telephone: '07 45 67 89 01',
      adresse: '12 rue de la République, Marseille',
      etat: 'Actif',

    },
    {
      id: 5,
      photo: 'https://img.freepik.com/premium-psd/3d-male-cute-cartoon-character-avatar-isolated-3d-rendering_235528-1296.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Lucas Petit',
      telephone: '06 56 78 90 12',
      adresse: '5 place Bellecour, Lyon',
      etat: 'Inactif',

    },
    {
      id: 6,
      photo: 'https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303091.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Emma Leroy',
      telephone: '07 67 89 01 23',
      adresse: '30 rue du Commerce, Bordeaux',
      etat: 'Actif',

    }
  ];

  openMenuId: number | null = null;

  toggleMenu(event: Event, rowId: number) {
    event.stopPropagation();
    this.openMenuId = this.openMenuId === rowId ? null : rowId;
  }

  onAction(action: 'view' | 'edit' | 'delete', rowId: number) {
    // Implémentez vos actions ici
    switch (action) {
      case 'view':
        console.log(`Voir les détails de l'item ${rowId}`);
        break;
      case 'edit':
        console.log(`Éditer l'item ${rowId}`);
        break;
      case 'delete':
        console.log(`Supprimer l'item ${rowId}`);
        break;
    }
    this.openMenuId = null; // Ferme le menu après l'action
  }

  @HostListener('document:click')
  closeMenu() {
    this.openMenuId = null;
  }

  // Initialisation avec ngOnInit
  ngOnInit() {
    this.initializeChartDataCategorie();
    this.initializeChartDataLivreur();
  }


  dataLivraison: any;
  optionsLivraison: any;
  chartDataLivreur: any;
  chartOptionsCategorie: any;

  // Données Paiement recu par mois
  initializeChartDataCategorie(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );

    this.dataLivraison = {
      labels: [
        'Janvier',
        'Fevrier',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Aout',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
      datasets: [
        {
          label: 'Nombre de livraisons ',
          backgroundColor: documentStyle.getPropertyValue('--bg-blue2'),
          borderColor: documentStyle.getPropertyValue('--bg-blue2'),
          data: [450, 500, 350, 420, 560, 390, 340, 310, 480, 390, 450, 620],
          barThickness: 15,
        },
      ],
    };

    this.optionsLivraison = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
          },
          categoryPercentage: 0.2,
          barPercentage: 0.3,
        },
        y: {
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500,
            },
            stepSize: 10,
            beginAtZero: true,
            max: 100,
          },
          grid: {
            display: false,
          },
        },
      },
    };
  }

  livreurs = [
    { id: 1, name: 'Alioune Ndiaye' },
    { id: 2, name: 'Chloé Moulin' },
    { id: 3, name: 'Maxence Dufresne' },
    { id: 4, name: 'Emma Leroy' },
    { id: 5, name: 'Lucas Petit' },
    { id: 6, name: 'Sophie Dubois' },
    { id: 7, name: 'Hugo Boisvert' },
    { id: 8, name: 'Valérie Perrin' },
    { id: 9, name: 'Mathilde Brunel' },
    { id: 10, name: 'Aurélien Dufour' },
    { id: 11, name: 'Yannick Delmas' },
  ]

  initializeChartDataLivreur(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const bgColorBlue = documentStyle.getPropertyValue('--bg-blue2');
    const bgColorGreen = documentStyle.getPropertyValue('--bg-primary');
    const bgColorCyan = documentStyle.getPropertyValue('--bg-blue1');

    this.chartDataLivreur = [
      {
        labels: ['Progression', 'Reste'],
        datasets: [
          {
            data: [28, 72],
            backgroundColor: [bgColorBlue, '#E0E0E0'], // Bleu et gris
          },
        ],
      },
      {
        labels: ['Progression', 'Reste'],
        datasets: [
          {
            data: [22, 78],
            backgroundColor: [bgColorCyan, '#E0E0E0'], // Cyan et gris
          },
        ],
      },
      {
        labels: ['Progression', 'Reste'],
        datasets: [
          {
            data: [32, 68],
            backgroundColor: [bgColorGreen, '#E0E0E0'], // Vert et gris
          },
        ],
      },
    ];

    this.chartOptionsCategorie = {
      cutout: '70%',
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  showPassword = false;
  // afficher mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // contrôler la visibilité du modal ajout livreur
  visibleAddLivreur: boolean = false;
  showDialogAddLivreur() {
    this.visibleAddLivreur = true;
  }
  //fermer modal
  closeModal() {
    this.visibleAddLivreur = false;
  }



}
