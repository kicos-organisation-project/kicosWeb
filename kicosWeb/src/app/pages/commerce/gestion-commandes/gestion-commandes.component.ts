import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-gestion-commandes',
  standalone: true,
  imports: [TabViewModule, TableModule, DialogModule, PaginatorModule],
  templateUrl: './gestion-commandes.component.html',
  styleUrl: './gestion-commandes.component.css'
})
export class GestionCommandesComponent {
  // contrôler la visibilité du modal details commandes
  visible: boolean = false;
  showDialogDetailCommande() {
    this.visible = true;
  }

  //fermer modal
  closeModal() {
    this.visible = false;
  }

  // les varaibles utilisees
  first: number = 0;
  rows: number = 6;
  // les événements de pagination
  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  demandeLivreur = [
    {
      id: 1,
      photo: 'https://img.freepik.com/free-vector/young-afro-man-smiling_24877-81870.jpg?ga=GA1.1.2125268813.1733426263&semt=ais_hybrid',
      nomComplet: 'Thomas Martin',
      statut: 'Employés',
      action: 'Modifier'
    },
    {
      id: 2,
      photo: 'https://img.freepik.com/free-vector/cute-girl-student-wearing-face-mask-cleansing-hands-with-hand-soap-protection-virus-covid19_40876-3285.jpg?t=st=1733949226~exp=1733952826~hmac=07a6ee7132dad8ec340939a6f9a12bf56d865c3c3a049b7062f9f337449088ca&w=740',
      nomComplet: 'Sophie Dubois',
      statut: 'Particuliers',
      action: 'Supprimer'
    },
    {
      id: 3,
      photo: 'https://img.freepik.com/free-vector/young-bearded-man_24877-82119.jpg?t=st=1733949040~exp=1733952640~hmac=991bed926bf4da7600ecdd7d64e469f0fd7b55729f2e33e35540e4d705b76da5&w=740',
      nomComplet: 'Pierre Durand',
      statut: 'Employés',
      action: 'Modifier'
    },
    {
      id: 4,
      photo: 'https://img.freepik.com/free-vector/woman-working-with-laptop-successful-cute-cartoon-character-doodle-style_40876-3220.jpg?t=st=1733949171~exp=1733952771~hmac=26f9d48dec6b4b4481a18705c916ceddda7513ea8686f0ec1c2680ff4b5cfe40&w=740',
      nomComplet: 'Marie Lambert',
      statut: 'Particuliers',
      action: 'Supprimer'
    },
    {
      id: 5,
      photo: 'https://img.freepik.com/free-vector/purple-man-with-blue-hair_24877-82003.jpg?t=st=1733949092~exp=1733952692~hmac=cad4495a499bec5b0cb70e544eae109ffbd918179491ccdee118475b85ae5008&w=740',
      nomComplet: 'Lucas Bernard',
      statut: 'Employés',
      action: 'Modifier'
    },
    {
      id: 6,
      photo: 'https://img.freepik.com/free-vector/cute-girl-student-wearing-face-mask-cleansing-hands-with-hand-soap-protection-virus-covid19_40876-3285.jpg?t=st=1733949226~exp=1733952826~hmac=07a6ee7132dad8ec340939a6f9a12bf56d865c3c3a049b7062f9f337449088ca&w=740',
      nomComplet: 'Emma Petit',
      statut: 'Particuliers',
      action: 'Supprimer'
    }
  ];
}
