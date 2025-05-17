import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilLivreurComponent } from './accueil-livreur/accueil-livreur.component';
import { HistoriqueComponent } from './historique/historique.component';
import { GainsComponent } from './gains/gains.component';
import { ProfilComponent } from './profil/profil.component';
import { GestionPaiementsComponent } from './gestion-paiements/gestion-paiements.component';





const routes: Routes = [
  { path: 'dashboard', component: AccueilLivreurComponent },
  { path: 'historiques', component: HistoriqueComponent },
  { path: 'gains', component: GainsComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'paie', component: GestionPaiementsComponent },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivreurRoutingModule { }
