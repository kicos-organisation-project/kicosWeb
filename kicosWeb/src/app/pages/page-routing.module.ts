import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { LoginComponent } from './main/login/login.component';


const routes: Routes = [
    {path: '', component: LoginComponent},
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    {
        path: 'kicos', component: DashboardComponent, children: [
            { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
            { path: 'commerce', loadChildren: () => import('./commerce/commerce.module').then(m => m.CommerceModule) },
            { path: 'livreur', loadChildren: () => import('./livreur/livreur.module').then(m => m.LivreurModule) },
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PageModuleRoutingModule { }
