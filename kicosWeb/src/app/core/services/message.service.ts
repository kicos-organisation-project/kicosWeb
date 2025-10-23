import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  createMessage(type: SweetAlertIcon, message: string): void {
    // Fermer les alertes existantes
    Swal.close();
    
    Swal.fire({
      position: 'top-end',
      toast: true,
      icon: type,
      title: message,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#3C476D',
      color: '#fff',
      // Important pour le positionnement
      heightAuto: false,
      // S'assurer qu'il soit au-dessus des modals
      willOpen: () => {
        // Créer un container avec z-index élevé
        const container = document.createElement('div');
        container.className = 'swal2-container swal2-center swal2-backdrop-show';
        container.style.zIndex = '99999';
      },
      didOpen: (toast) => {
        // Forcer le z-index
        toast.style.zIndex = '100000';
        const backdrop = document.querySelector('.swal2-container');
        if (backdrop) {
          (backdrop as HTMLElement).style.zIndex = '99999';
        }
      }
    });
  }
}