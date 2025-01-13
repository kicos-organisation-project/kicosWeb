import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-liste-commandes',
  standalone: true,
  imports: [TableModule],
  templateUrl: './liste-commandes.component.html',
  styleUrl: './liste-commandes.component.css'
})
export class ListeCommandesComponent {
  tabcommande: any[] = [];

  tabCommande = [
    {
      id: 1,
      client: 'Dupont SA',
      produit: 'Ordinateur portable',
      quantite: 5,
      etat: 'En cours',
      etablissement: 'Paris',
      action: 'Modifier'
    },
    {
      id: 2,
      client: 'Martin SARL',
      produit: 'Écran 24"',
      quantite: 10,
      etat: 'Livré',
      etablissement: 'Lyon',
      action: 'Supprimer'
    },
    {
      id: 3,
      client: 'Tech Solutions',
      produit: 'Clavier sans fil',
      quantite: 15,
      etat: 'En attente',
      etablissement: 'Marseille',
      action: 'Valider'
    },
    {
      id: 4,
      client: 'InfoSys Plus',
      produit: 'Souris gaming',
      quantite: 20,
      etat: 'En préparation',
      etablissement: 'Bordeaux',
      action: 'Modifier'
    },
    {
      id: 5,
      client: 'Bureau Pro',
      produit: 'Station d\'accueil',
      quantite: 8,
      etat: 'Expédié',
      etablissement: 'Toulouse',
      action: 'Supprimer'
    },
    {
      id: 6,
      client: 'Digital Services',
      produit: 'Casque bluetooth',
      quantite: 12,
      etat: 'En cours',
      etablissement: 'Nantes',
      action: 'Valider'
    }
  ];


}
