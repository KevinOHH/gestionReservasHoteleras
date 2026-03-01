import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../models/Huesped.model';

@Injectable({ providedIn: 'root' })
export class HuespedService {

  private apiUrl: string = environment.apiUrl.concat('huespedes');

  constructor(private http: HttpClient) {}

  getAll(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.apiUrl).pipe(
      map(huespedes => huespedes.sort()),
      catchError(error => {
        console.error('Error al obtener los huéspedes: ', error);
        return of([]);
      })
    );
  }

  getById(id: number): Observable<HuespedResponse> {
    return this.http.get<HuespedResponse>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener el huésped: ', error);
        throw error;
      })
    );
  }
  

  getByHuespedId(id: number): Observable<HuespedResponse> {
    return this.http.get<HuespedResponse>(`${this.apiUrl}/id-huesped/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener el huésped por id-huesped: ', error);
        throw error;
      })
    );
  }

  create(huesped: HuespedRequest): Observable<HuespedResponse> {
    return this.http.post<HuespedResponse>(this.apiUrl, huesped).pipe(
      catchError(error => {
        console.error('Error al registrar el huésped: ', error);
        throw error;
      })
    );
  }

  update(id: number, huesped: HuespedRequest): Observable<HuespedResponse> {
    return this.http.put<HuespedResponse>(`${this.apiUrl}/${id}`, huesped).pipe(
      catchError(error => {
        console.error('Error al actualizar el huésped: ', error);
        throw error;
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar el huésped: ', error);
        throw error;
      })
    );
  }
}