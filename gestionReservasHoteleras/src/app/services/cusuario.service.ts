import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CUsuarioRequest, CUsuarioResponse } from '../models/CUsuario.model';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class CUsuarioService {

  private apiUrl = 'http://localhost:9000/admin/usuarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CUsuarioResponse[]> {
    return this.http.get<CUsuarioResponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<CUsuarioResponse> {
    return this.http.get<CUsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: CUsuarioRequest): Observable<CUsuarioResponse> {
    return this.http.post<CUsuarioResponse>(this.apiUrl, request);
  }

  update(id: number, request: CUsuarioRequest): Observable<CUsuarioResponse> {
    return this.http.put<CUsuarioResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<CUsuarioResponse> {
    return this.http.delete<CUsuarioResponse>(`${this.apiUrl}/${id}`);
  }
}