import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NFe, NFeListResponse } from '../../interfaces/nfe.interface';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NFeService {
  private readonly http = inject(HttpClient);
  private readonly BASE = `${environment.apiUrl}/api/v1`;

  getList(page = 1, limit = 50): Observable<NFeListResponse> {
    return this.http.get<NFeListResponse>(`${this.BASE}/nfe`, {
      params: { page: page.toString(), limit: limit.toString() },
    });
  }

  getById(id: string): Observable<NFe> {
    return this.http.get<NFe>(`${this.BASE}/nfe/${id}`);
  }

  upload(file: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post(`${this.BASE}/nfe/uploads`, formData);
  }
}
