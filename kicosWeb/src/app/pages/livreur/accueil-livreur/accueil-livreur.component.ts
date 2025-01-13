import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-accueil-livreur',
  standalone: true,
  imports: [CommonModule,ChartModule],
  templateUrl: './accueil-livreur.component.html',
  styleUrl: './accueil-livreur.component.css'
})
export class AccueilLivreurComponent  implements OnInit{
  gaugeData: any;
  gaugeOptions: any;
  lineData: any;
  lineOptions: any;
  barData: any;
  barOptions: any;
  timePeriods = ['12 Mois', '3 mois', '30 jours', '7 jours', '24 heure'];
  selectedPeriod = '12 Mois';

  ngOnInit() {
    this.initGaugeChart();
    this.initLineChart();
    this.initBarChart();
  }

  private initGaugeChart() {
    this.gaugeData = {
      datasets: [{
        data: [75],
        backgroundColor: ['#00BCD4'],
        borderWidth: 0,
        circumference: 180,
        rotation: 270,
      }]
    };

    this.gaugeOptions = {
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      cutout: '85%',
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private initLineChart() {
    this.lineData = {
      labels: ['Jan', 'Feb', 'March', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Livraisons',
        data: [250, 200, 300, 350, 400, 450, 500, 550, 600, 550, 500, 450],
        borderColor: '#00BCD4',
        tension: 0.4,
        fill: false,
        pointRadius: 0
      }]
    };

    this.lineOptions = {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 1000,
          ticks: {
            stepSize: 200
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  private initBarChart() {
    this.barData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
      datasets: [
        {
          label: 'Série 1',
          data: [65, 45, 80, 45, 70, 45, 65, 45],
          backgroundColor: '#FF9800'
        },
        {
          label: 'Série 2',
          data: [40, 60, 35, 65, 35, 65, 45, 55],
          backgroundColor: '#00BCD4'
        }
      ]
    };

    this.barOptions = {
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          display: false,
          grid: {
            display: false
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false,
      barPercentage: 0.4
    };
  }
}
