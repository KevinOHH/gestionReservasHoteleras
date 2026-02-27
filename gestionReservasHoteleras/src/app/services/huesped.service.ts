import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../models/Huesped.model';

@Injectable({ providedIn: 'root' })
export class HuespedService {
  private readonly API = 'http://localhost:8082/api/huespedes';

  constructor(private http: HttpClient) {}

  getAll(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.API);
  }

  getById(id: number): Observable<HuespedResponse> {
    return this.http.get<HuespedResponse>(`${this.API}/${id}`);
  }

  getByHuespedId(id: number): Observable<HuespedResponse> {
    return this.http.get<HuespedResponse>(`${this.API}/id-huesped/${id}`);
  }

  create(data: HuespedRequest): Observable<HuespedResponse> {
    return this.http.post<HuespedResponse>(this.API, data);
  }

  update(id: number, data: HuespedRequest): Observable<HuespedResponse> {
    return this.http.put<HuespedResponse>(`${this.API}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}