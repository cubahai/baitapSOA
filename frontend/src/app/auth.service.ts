import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  // Gọi API Đăng nhập
  login(userName: string, passwordRaw: string): Observable<any> {
    const passwordBase64 = btoa(passwordRaw); // Mã hoá Base64 tại Client
    return this.http.post<any>(`${this.apiUrl}/`, { userName, password: passwordBase64 });
  }

  saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Gọi API Hello World với Token đính kèm
  testHelloApi(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/hello`, { headers, responseType: 'text' });
  }
}