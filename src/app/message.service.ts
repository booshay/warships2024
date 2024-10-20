import { Injectable } from '@angular/core';
import { ToastrService, ActiveToast } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private loadingToast?: ActiveToast<any>;

  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string) {
    this.toastr.success(message, title, { positionClass: 'toast-top-center' });
  }

  showError(message: string, title: string) {
    this.toastr.error(message, title, { positionClass: 'toast-top-center' });
  }

  showLoading(message: string) {
    // Store the reference to the loading toast to be able to close it later
    this.loadingToast = this.toastr.info(message, '', {
      disableTimeOut: true, // Keeps the toast open until manually dismissed
      positionClass: 'toast-top-center',
      tapToDismiss: false,
      closeButton: false
    });
  }

  hideLoading() {
    if (this.loadingToast) {
      this.toastr.clear(this.loadingToast.toastId);
      this.loadingToast = undefined;
    }
  }
}
