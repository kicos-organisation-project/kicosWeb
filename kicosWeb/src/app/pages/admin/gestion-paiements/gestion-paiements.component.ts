import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-gestion-paiements',
  standalone: true,
  imports: [TabViewModule, TableModule],
  templateUrl: './gestion-paiements.component.html',
  styleUrl: './gestion-paiements.component.css'
})
export class GestionPaiementsComponent {

  demandeCommerce = [
    {
      id: 1,
      photo: "https://img.freepik.com/photos-gratuite/restaurant-italien-moderne_23-2148956171.jpg",
      responsable: "Michel Laurent",
      dateDemande: "2024-03-10",
      demande: "Demande de paiement 2500€ - Restaurant Bella Italia",
      action: "Valider"
    },
    {
      id: 2,
      photo: "https://img.freepik.com/photos-gratuite/magasin-vetements_1150-8324.jpg",
      responsable: "Sarah Dubois",
      dateDemande: "2024-03-11",
      demande: "Demande de paiement 1850€ - Boutique Mode&Style",
      action: "En attente"
    },
    {
      id: 3,
      photo: "https://img.freepik.com/photos-gratuite/cafe-moderne-exterieur_23-2148956170.jpg",
      responsable: "Antoine Moreau",
      dateDemande: "2024-03-12",
      demande: "Demande de paiement 3200€ - Café des Arts",
      action: "Refuser"
    },
    {
      id: 4,
      photo: "https://img.freepik.com/photos-gratuite/boulangerie-moderne_23-2148956172.jpg",
      responsable: "Marie Petit",
      dateDemande: "2024-03-13",
      demande: "Demande de paiement 1200€ - Boulangerie du Coin",
      action: "Valider"
    },
    {
      id: 5,
      photo: "https://img.freepik.com/photos-gratuite/supermarche-moderne_1150-8325.jpg",
      responsable: "Thomas Bernard",
      dateDemande: "2024-03-14",
      demande: "Demande de paiement 4500€ - Épicerie Bio",
      action: "En attente"
    },
    {
      id: 6,
      photo: "https://img.freepik.com/photos-gratuite/pharmacie-moderne_23-2148956173.jpg",
      responsable: "Claire Martin",
      dateDemande: "2024-03-15",
      demande: "Demande de paiement 2800€ - Pharmacie Centrale",
      action: "En cours"
    }
  ];

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
