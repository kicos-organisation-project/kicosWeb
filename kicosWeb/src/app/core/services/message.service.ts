import { Injectable } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  // constructor(private message: any) {}

  // Permet d'afficher un massage (succes, error, warning ...)
  createMessage(type: SweetAlertIcon, message: string): void {
    // const customClass = this.getCustomClassForType(type);

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
      // customClass: {
      //   container: customClass, // Utilisation de la classe CSS personnalisée
      //   title: 'my-toast-title',
      //   timerProgressBar: 'my-progress-bar',
      // },
    });
  }

  // Retourne la classe CSS en fonction du type de message
  private getCustomClassForType(type: SweetAlertIcon): string {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      default:
        return 'toast-default'; // Classe par défaut
    }
  }
}
