import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge'
import { DialogModule } from 'primeng/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from '../../../core/services/message.service';

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
  message: string = '';

  baseUrl = environment.base_url;
  apiService = inject(ApiService);
  authService = inject(AuthService);
 messageService = inject(MessageService);
  // Constructeur
  constructor(
    private menuService: MenuService,
    private router: Router,
  ) { }

  notification = inject(NotificationService);

  visible: boolean = false;

  position: DialogPosition = 'topright';

  showDialog(position: DialogPosition) {
    this.position = position;
    this.visible = true;
  }

  ngOnInit(): void {
    // Récupère les menus accessibles à l'utilisateur connecté
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      this.userInfo = JSON.parse(storedUserInfo);
      this.userRole = this.userInfo.role;
      if (this.userRole === 'admin') {
        this.menus = this.menuService.menus.admin;
      } else if (this.userRole === 'partenaire') {
        this.menus = this.menuService.menus.commerce;
      } else {
        this.menus = this.menuService.menus.livreur;
      }
    }

    console.log('Initialisation de l\'abonnement aux notifications');
    const livreurId = this.userInfo.id;

    this.notification.subscribeToLivreurNotifications((data) => {
      console.log('Notification reçue dans le composant:', data);
      // Ici tu peux déclencher une alerte, mettre à jour l'interface, etc.
    });

    if (this.userRole == 'livreur') {
      this.listNotif();
    }
    // this.listNotif();


    this.getInfolivreur();

  }

  notificationlist: any;
  // recup notif
  listNotif() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/notifications`).subscribe(
      (response: any) => {
        this.notificationlist = response.notifications;

        console.log('liste notif', this.notificationlist);

        if (this.notificationlist.length > 0) {
          this.hasNewNotifications = true;
        }
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
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
    this.authService.logout();
  }


  isNotificationOpen = false;
  hasNewNotifications = false;
  notifications: Notification[] = [];

  // toggleNotifications() {
  //   this.isNotificationOpen = !this.isNotificationOpen;
  // }

  acceptNotification(id_commande: number) {
    this.apiService.postWithSessionId(`${this.baseUrl}/livreurs/accept-order/${id_commande}/${this.profilLivreur.livreur.id}`, '').subscribe(
      (response: any) => {
        console.log(response);
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }

  // rejectNotification(id: number) {
  //   this.notifications = this.notifications.filter(n => n.id !== id);
  // }

  profilLivreur: any;
  // infos profil livreur
  getInfolivreur() {
    this.apiService.getRequestWithSessionId(`${this.baseUrl}/profile`).subscribe(
      (response: any) => {
        this.profilLivreur = response.data;
      },
      (error: any) => {
        this.messageService.createMessage('error', error.error.message);
      }
    );
  }
}
