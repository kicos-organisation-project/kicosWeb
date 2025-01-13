import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccueilLivreurComponent } from './accueil-livreur/accueil-livreur.component';
import { HistoriqueComponent } from './historique/historique.component';
import { GainsComponent } from './gains/gains.component';





const routes: Routes = [
    {path: 'dashboard', component:AccueilLivreurComponent},
    {path: 'historiques', component: HistoriqueComponent}, 
    {path: 'gains', component: GainsComponent},
    {path: '**', redirectTo: 'dashboard', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivreurRoutingModule { }
