import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/page.module').then(m => m.PageModuleModule) },
  
];
