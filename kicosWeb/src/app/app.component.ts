import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaUpdateService } from './core/services/pwa-update.service';
import { PwaInstallService } from './core/services/pwa-install.service';
import { NotificationService } from './core/services/notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'kicosExpress';

  private readonly pwaUpdate = inject(PwaUpdateService);
  readonly pwaInstall = inject(PwaInstallService);
  private readonly notifications = inject(NotificationService);

  ngOnInit(): void {
    this.pwaUpdate.watchForUpdates();
    this.pwaInstall.init();
    void this.notifications.ensureNotificationPermission();
  }
}
