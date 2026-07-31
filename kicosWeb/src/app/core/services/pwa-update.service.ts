import { Injectable } from '@angular/core';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  private readonly updates: any = null;

  watchForUpdates(): void {
    if (!this.updates?.isEnabled) {
      return;
    }

    this.updates.versionUpdates
      .pipe(filter((event: any) => event?.type === 'VERSION_READY'))
      .subscribe(() => {
        const reload = confirm(
          'Une nouvelle version de Kicos Express est disponible. Recharger maintenant ?'
        );
        if (reload) {
          this.updates.activateUpdate().then(() => document.location.reload());
        }
      });

    // Check periodically (every 6h) when app is open
    setInterval(() => {
      this.updates.checkForUpdate().catch(() => undefined);
    }, 6 * 60 * 60 * 1000);
  }
}
