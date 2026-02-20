import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthBaseComponent } from '../auth-base.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent extends AuthBaseComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get email() {
    return this.form.get('email')!;
  }
  get password() {
    return this.form.get('password')!;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.login();
  }

  private login(): void {
    this.authService.login(this.form.getRawValue() as any).subscribe({
      next: () => this.handleLoginSuccess(),
      error: (err) => this.handleLoginError(err),
    });
  }

  private handleLoginSuccess(): void {
    this.handleSuccess('Login realizado com sucesso!');
  }

  private handleLoginError(err: any): void {
    this.handleError(err, 'Credenciais inválidas.');
  }
}
