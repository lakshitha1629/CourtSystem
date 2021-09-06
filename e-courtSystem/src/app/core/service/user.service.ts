import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  login(formData) { return this.http.post(`${environment.apiUrl}api/AuthManagement/Login`, formData); }

  register(formData) { return this.http.post(`${environment.apiUrl}api/AuthManagement/Register`, formData); }
}
