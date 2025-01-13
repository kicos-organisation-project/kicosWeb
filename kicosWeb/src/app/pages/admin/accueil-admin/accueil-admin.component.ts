import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-accueil-admin',
  standalone: true,
  imports: [ChartModule, RouterModule, CommonModule],
  templateUrl: './accueil-admin.component.html',
  styleUrl: './accueil-admin.component.css'
})
export class AccueilAdminComponent {

  dataCategogrie: any;
  optionsCategogrie: any;
  dataVentes: any;
  optionsVentes: any;
  userInfo: any;
  userRole: any;
  deliveryZoneData: any;
  deliveryZoneOptions: any;
  selectedMonth = 'Jan';


  // Initialisation avec ngOnInit
  ngOnInit() {
    this.initializeChartDataCategorie();
    this.initializeDeliveryZoneChart();
  }

  // Données Paiement recu par mois
  initializeChartDataCategorie(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );

    this.dataCategogrie = {
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
          label: 'Paiement reçu par mois',
          backgroundColor: documentStyle.getPropertyValue('--bg-primary'),
          borderColor: documentStyle.getPropertyValue('--bg-primary'),
          data: [400, 500, 350, 420, 560, 290, 340, 310,280, 390, 350, 420],
          barThickness: 15,
          borderRadius: 5
        },
      ],
    };

    this.optionsCategogrie = {
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

  // Données Zone de livraison
  initializeDeliveryZoneChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  
    this.deliveryZoneData = {
      labels: ['Zone A', 'Zone B', 'Zone C'],
      datasets: [
        {
          label: 'Zone A',
          backgroundColor: documentStyle.getPropertyValue('--bg-blue1'),
          borderColor: 'rgb(33, 150, 243)',
          data: [90, 0, 0],
          barThickness: 40,
          borderRadius: 5,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: documentStyle.getPropertyValue('--bg-blue1'),
        },
        {
          label: 'Zone B',
          backgroundColor: documentStyle.getPropertyValue('--bg-primary'),
          borderColor: 'rgb(255, 152, 0)',
          data: [0, 65, 0],
          barThickness: 40,
          borderRadius: 5,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: documentStyle.getPropertyValue('--bg-primary'),
        },
        {
          label: 'Zone C',
          backgroundColor: documentStyle.getPropertyValue('--bg-blue2'),
          borderColor: 'rgb(80, 203, 203)',
          data: [0, 0, 75],
          barThickness: 40,
          borderRadius: 5,
          shadowOffsetX: 3,
          shadowOffsetY: 3,
          shadowBlur: 10,
          shadowColor: documentStyle.getPropertyValue('--bg-blue2'),
        }
      ]
    };
  
    this.deliveryZoneOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          display: true,
          position: 'left',
          align: 'center',
          labels: {
            color: textColor,
            usePointStyle: true,
            padding: 45,
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'En pourcentage (%)',
          align: 'end',
          color: textColor,
          font: {
            size: 16,
          },
          padding: 20
        },
        // Configuration de l'ombre intégrée dans le même objet plugins
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.1)',
          blur: 10,
          offsetY: 4,
          offsetX: 4
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            }
          },
          grid: {
            display: false,
            drawBorder: false
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
            font: {
              weight: 500
            },
            stepSize: 25,
            beginAtZero: true,
            max: 100
          },
          grid: {
            color: 'rgba(235, 237, 239, 0.5)',
            drawBorder: false
          }
        }
      }
    };
  }

  scorer = [
    {
      id: 1,
      name: 'Jean Pierre',
      role: 'Livreur 1',
      score: '99.99%',
      position: '1st',
      bgColor: 'bg-blue',
      pp:'https://attic.sh/bxn8k8wieyy4tkzqxf7campw331x'
    },
    {
      id: 2,
      name: 'Mouhamed bin Ali',
      role: 'Livreur 2',
      score: '99.76%',
      position: '2nd',
      bgColor: 'bg-orange',
      pp:'https://attic.sh/8fz1w80eqzhz2nvdw58ljiqjxq07'
    },
    {
      id: 3,
      name: 'Julie FAYE',
      role: 'Livreur 3',
      score: '99.50%',
      position: '3rd',
      bgColor: 'bg-teal',
      pp:'https://attic.sh/37gyakbm4nk9ypsb5udkla6v9g68'
    }
  ];

  months =[
    { id: 1, name: 'Janvier' },
    { id: 2, name: 'Février' },
    { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' },
    { id: 5, name: 'Mai' },
    { id: 6, name: 'Juin' },
    { id: 7, name: 'Juillet' },
    { id: 8, name: 'Aout' },
    { id: 9, name: 'Septembre' },
    { id: 10, name: 'Octobre' },
    { id: 11, name: 'Novembre' },
    { id: 12, name: 'Décembre' },
  ]

 
}
