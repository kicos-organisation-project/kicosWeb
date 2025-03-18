import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilCommerceComponent } from './accueil-commerce/accueil-commerce.component';
import { GestionArticlesComponent } from './gestion-articles/gestion-articles.component';
import { GestionCommandesComponent } from './gestion-commandes/gestion-commandes.component';
import { GestionAvisComponent } from './gestion-avis/gestion-avis.component';
import { DemandePaiementComponent } from './demande-paiement/demande-paiement.component';




const routes: Routes = [
    {path: 'dashboard', component:AccueilCommerceComponent},
    {path: 'articles', component: GestionArticlesComponent}, 
    {path: 'detailArticle/:id', component: GestionAvisComponent},
    {path: 'commandes', component: GestionCommandesComponent},
    {path: 'paiement', component: DemandePaiementComponent},
    {path: '**', redirectTo: 'dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommerceRoutingModule { }
