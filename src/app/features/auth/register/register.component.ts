import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthBaseComponent } from '../auth-base.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent extends AuthBaseComponent {
  private readonly fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  get name() {
    return this.form.get('name')!;
  }
  get email() {
    return this.form.get('email')!;
  }
  get password() {
    return this.form.get('password')!;
  }
  get confirmPassword() {
    return this.form.get('confirmPassword')!;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    if (this.form.value.password !== this.form.value.confirmPassword) {
      this.toast.error('As senhas não coincidem.');

      return;
    }

    this.loading = true;
    this.register();
  }

  private register(): void {
    const { name, email, password, confirmPassword } = this.form.getRawValue() as any;
    
    this.authService.register({ name, email, password, confirmPassword }).subscribe({
      next: () => this.authenticateAfterRegister(email, password),
      error: (err) => this.handleError(err, 'Erro ao criar conta.'),
    });
  }

  private authenticateAfterRegister(email: string, password: string): void {
    this.authService.login({ email, password }).subscribe({
      next: () => this.handleSuccess('Conta criada e autenticada com sucesso!'),
      error: (err) => {
        this.toast.error('Conta criada, mas falha no login automático.');
        this.router.navigate(['/login']);
        this.loading = false;
      },
    });
  }
}
