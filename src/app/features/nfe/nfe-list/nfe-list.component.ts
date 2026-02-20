import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NFeService } from '../../../core/services/nfe.service';
import { ToastService } from '../../../core/services/toast.service';
import { NFe } from '../../../interfaces/nfe.interface';
import { formatCnpj, formatCurrency, formatDate } from '../../../shared/utils/format.utils';

@Component({
  selector: 'app-nfe-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nfe-list.component.html',
})
export class NFeListComponent implements OnInit {
  private readonly nfeService = inject(NFeService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  
  readonly formatCnpj = formatCnpj;
  readonly formatCurrency = formatCurrency;
  readonly formatDate = formatDate;
  readonly LIMIT = 50;

  nfes = signal<NFe[]>([]);
  loading = signal(true);
  totalItems = signal(0);
  currentPage = signal(1);

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.LIMIT);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.setLoadingState(page);
    this.nfeService.getList(page, this.LIMIT).subscribe({
      next: (res) => this.onLoadSuccess(res),
      error: () => this.onLoadError(),
    });
  }

  viewDetail(nfe: NFe): void {
    this.router.navigate(['/dashboard/nfe', nfe.id]);
  }

  private setLoadingState(page: number): void {
    this.loading.set(true);
    this.currentPage.set(page);
  }

  private onLoadSuccess(res: { data: NFe[]; total: number }): void {
    this.nfes.set(res.data);
    this.totalItems.set(res.total);
    this.loading.set(false);
  }

  private onLoadError(): void {
    this.toast.error('Erro ao carregar notas fiscais.');
    this.loading.set(false);
  }
}
