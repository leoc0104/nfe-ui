import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

export abstract class AuthBaseComponent {
  protected readonly authService = inject(AuthService);
  protected readonly router = inject(Router);
  protected readonly toast = inject(ToastService);

  loading = false;

  protected handleSuccess(message: string): void {
    this.toast.success(message);
    this.router.navigate(['/dashboard/upload']);
  }

  protected handleError(err: any, fallbackMessage: string): void {
    this.toast.error(err?.error?.message ?? fallbackMessage);
    this.loading = false;
  }
}
