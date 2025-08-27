import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  constructor() { }

  menus: any =
    {
      admin: [
        { title: 'Tableau de bord', route: './admin/dashboard', icon: 'pi pi-home', access: [] },
        { title: 'Gestion Partenaires', route: './admin/commerce', icon: 'bi bi-basket2', access: [] },
        { title: 'Gestion Livreurs', route: './admin/livreur', icon: 'pi pi-user', access: [] },
        { title: 'Gestion Catégories', route: './admin/categorie', icon: 'pi pi-objects-column', access: [] },
        { title: 'Gestion clients', route: './admin/clients', icon: 'pi pi-users', access: [] },
        { title: 'Paiements', route: './admin/paie', icon: 'pi pi-money-bill', access: [] },
        { title: 'Profil', route: './admin/profil', icon: 'pi pi-user', access: [] }

      ],
      commerce: [
        { title: 'Tableau de bord', route: './commerce/dashboard', icon: 'pi  pi-home', access: [] },
        { title: 'Gestion des Articles', route: './commerce/articles', icon: 'bi  bi-bag', access: [] },
        { title: 'Commandes', route: './commerce/commandes', icon: 'pi pi-cart-arrow-down', access: [] },
        { title: 'Demande paiement', route: './commerce/paiement', icon: 'pi pi-wallet', access: [] },
        { title: 'Profil', route: './commerce/profil', icon: 'pi pi-user', access: [] }
      ],
      livreur: [
        { title: 'Tableau de bord', route: './livreur/dashboard', icon: 'pi  pi-home', access: [] },
        { title: 'Historique', route: './livreur/historiques', icon: 'bi bi-pin-map', access: [] },
        { title: 'Mes Gains', route: './livreur/gains', icon: 'pi pi-wallet', access: [] },
        { title: 'Paiements', route: './livreur/paie', icon: 'pi pi-money-bill', access: [] },
        { title: 'Profil', route: './livreur/profil', icon: 'pi pi-user', access: [] }
      ]
    }
}
