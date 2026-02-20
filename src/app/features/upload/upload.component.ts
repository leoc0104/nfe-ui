import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NFeService } from '../../core/services/nfe.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
})
export class UploadComponent {
  private readonly nfeService = inject(NFeService);
  private readonly toast = inject(ToastService);

  isDragging = signal(false);
  uploading = signal(false);
  uploadedFiles = signal<{ name: string; status: 'success' | 'error'; message: string }[]>([]);

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(): void {
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;

    if (files) {
      this.processFiles(Array.from(files));
    }
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      this.processFiles(Array.from(input.files));
      input.value = '';
    }
  }

  clearHistory(): void {
    this.uploadedFiles.set([]);
  }

  private processFiles(files: File[]): void {
    const xmlFiles = files.filter((f) => f.name.endsWith('.xml'));

    if (xmlFiles.length === 0) {
      this.toast.error('Apenas arquivos XML são permitidos.');

      return;
    }

    xmlFiles.forEach((file) => this.uploadFile(file));
  }

  private uploadFile(file: File): void {
    this.uploading.set(true);
    this.nfeService.upload(file).subscribe({
      next: () => this.onUploadSuccess(file),
      error: (err) => this.onUploadError(file, err),
    });
  }

  private onUploadSuccess(file: File): void {
    this.addUploadResult(file.name, 'success', 'Importada com sucesso');
    this.toast.success(`${file.name} importada com sucesso!`);
    this.uploading.set(false);
  }

  private onUploadError(file: File, err: any): void {
    const msg = err?.error?.message ?? 'Erro ao processar arquivo.';
    this.addUploadResult(file.name, 'error', msg);
    this.toast.error(`Erro em ${file.name}: ${msg}`);
    this.uploading.set(false);
  }

  private addUploadResult(name: string, status: 'success' | 'error', message: string): void {
    this.uploadedFiles.update((list) => [...list, { name, status, message }]);
  }
}
