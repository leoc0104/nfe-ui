import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NFeService } from '../../../core/services/nfe.service';
import { ToastService } from '../../../core/services/toast.service';
import { NFe } from '../../../interfaces/nfe.interface';
import { formatCnpj, formatCurrency, formatDate } from '../../../shared/utils/format.utils';

@Component({
  selector: 'app-nfe-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nfe-detail.component.html',
})
export class NFeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly nfeService = inject(NFeService);
  private readonly toast = inject(ToastService);
  
  readonly formatCnpj = formatCnpj;
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;

  nfe = signal<NFe | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['/dashboard/nfe']);

      return;
    }

    this.nfeService.getById(id).subscribe({
      next: (nfe) => this.onLoadSuccess(nfe),
      error: () => this.onLoadError(),
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/nfe']);
  }

  private onLoadSuccess(nfe: NFe): void {
    this.nfe.set(nfe);
    this.loading.set(false);
  }

  private onLoadError(): void {
    this.toast.error('NF-e não encontrada.');
    this.router.navigate(['/dashboard/nfe']);
  }
}
