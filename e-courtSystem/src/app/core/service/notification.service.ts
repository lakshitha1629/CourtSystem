import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly http: HttpClient) { }

  getNotification(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}api/Notification`);
  }

  addNotification(notificationData: any) {
    return this.http.post<any>(`${environment.apiUrl}api/Notification`, notificationData);
  }

  updateNotificationStatus(notificationData: any) {
    return this.http.patch<any>(`${environment.apiUrl}api/Notification`, notificationData);
  }

  deleteNotification(notificationId: any) {
    return this.http.delete(`${environment.apiUrl}api/Notification/` + notificationId);
  }
}
