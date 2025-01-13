import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge'
import { DialogModule } from 'primeng/dialog';

type DialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

interface Notification {
  id: number;
  name: string;
  time: string;
  address: string;
  image: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    RouterModule,
    BadgeModule,
    DialogModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // Variables
  menus: any[] = [];
  userRole!: string;
  userInfo: any;
  isSidebarVisible: boolean = true;

  // Constructeur
  constructor(
    private menuService: MenuService,
    private router: Router,
  ) {}


  
  visible: boolean = false;

  position: DialogPosition = 'topright';

  showDialog(position: DialogPosition) {
      this.position = position;
      this.visible = true;
  }

  ngOnInit(): void {
    // Récupère les menus accessibles à l'utilisateur connecté
    const storedUserInfo = localStorage.getItem('userConnected');
    if (storedUserInfo) {
      this.userInfo = JSON.parse(storedUserInfo);
      this.userRole = this.userInfo.role;
      console.log('role userInfo: ' + this.userRole);
      if (this.userRole === 'admin') {
        this.menus = this.menuService.menus.admin;
      }else if (this.userRole === 'commerce') {
        this.menus = this.menuService.menus.commerce;
      }else{
        this.menus = this.menuService.menus.livreur;
      }
      console.log('Menus chargés:', this.menus);
    }

    this.notifications = [
      {
        id: 1,
        name: 'Jenny Wilson',
        time: '1mn ago',
        address: 'Ouakam',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFuv3XV-_htCR1zFqSflq8enLxArHNPDEY9Q&s'
      },
    ];
  }


  // sidebar toggle
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  // sidebar close
  closeSidebar() {
    this.isSidebarVisible = true;
  }

  // Méthode pour la déconnexion
  logout() {
    localStorage.removeItem('userConnected');
    this.router.navigate(['/login']);
    this.menus = [];
    this.userInfo = null;
    this.userRole = '';
    console.log('Déconnexion effectuée');
  }


  isNotificationOpen = false;
  hasNewNotifications = true;
  notifications: Notification[] = [];

  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
    if (this.isNotificationOpen) {
      this.hasNewNotifications = false;
    }
  }

  acceptNotification(id: number) {
    // Implémentez la logique d'acceptation
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  rejectNotification(id: number) {
    // Implémentez la logique de rejet
    this.notifications = this.notifications.filter(n => n.id !== id);
  }
}
