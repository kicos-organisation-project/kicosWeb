import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilAdminComponent } from './accueil-admin/accueil-admin.component';
import { GestionCommerceComponent } from './gestion-commerce/gestion-commerce.component';
import { ListeCommandesComponent } from './liste-commandes/liste-commandes.component';
import { GestionLivreurComponent } from './gestion-livreur/gestion-livreur.component';
import { GestionPaiementsComponent } from './gestion-paiements/gestion-paiements.component';



const routes: Routes = [
    {path: 'dashboard', component:AccueilAdminComponent},
    {path: 'commerce', component: GestionCommerceComponent},
    {path: 'commandes', component: ListeCommandesComponent},
    {path: 'livreur', component: GestionLivreurComponent},
    {path: 'paie', component: GestionPaiementsComponent},
    {path: '**', redirectTo: 'dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
