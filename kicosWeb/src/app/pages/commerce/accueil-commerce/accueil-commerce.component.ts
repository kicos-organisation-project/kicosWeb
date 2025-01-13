import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-accueil-commerce',
  standalone: true,
  imports: [CommonModule,ChartModule],
  templateUrl: './accueil-commerce.component.html',
  styleUrl: './accueil-commerce.component.css'
})
export class AccueilCommerceComponent {
  chartData: any;
  chartOptions: any;

  ngOnInit() {
    this.initChart();
  }

  private initChart() {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Evolution des ventes',
          data: [265, 359, 480, 156, 490, 788, 287],
          backgroundColor: '#F97316',
          borderRadius: 8,
          barPercentage: 0.4,

        }
      ]
    };

    this.chartOptions = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: false,
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
      maintainAspectRatio: false
    };
  }
}
