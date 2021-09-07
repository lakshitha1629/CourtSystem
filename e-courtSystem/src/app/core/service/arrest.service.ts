import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArrestService {

  constructor(private readonly http: HttpClient) { }

  getArrest(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Arrests`);
  }

  getArrestByStatus(status: number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Arrests/GetArrestByStatus/` + status);
  }

  addArrest(arrestData: any) {
    return this.http.post<any>(`${environment.apiUrl}api/Arrests`, arrestData);
  }

  updateArrest(arrestData: any) {
    return this.http.put<any>(`${environment.apiUrl}api/Arrests`, arrestData);
  }

  updateArrestStatus(arrestData: any) {
    return this.http.patch<any>(`${environment.apiUrl}api/Arrests`, arrestData);
  }

  deleteArrest(arrestId: any) {
    return this.http.delete(`${environment.apiUrl}api/Arrests/` + arrestId);
  }

}
