import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authApiUrl = 'http://localhost:3000';    // Cổng của Auth Service (Bài 2)
  private productApiUrl = 'http://localhost:3001'; // Cổng của Product Service (Bài 3)

  constructor(private http: HttpClient) {}

  // Helper tạo Header đính kèm JWT Token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // --- DỊCH VỤ BÀI 2: ĐĂNG NHẬP ---
  login(userName: string, passwordRaw: string): Observable<any> {
    const passwordBase64 = btoa(passwordRaw);
    return this.http.post<any>(`${this.authApiUrl}/`, { userName, password: passwordBase64 });
  }

  saveToken(token: string) {
    localStorage.setItem('jwt_token', token);
  }

  // --- DỊCH VỤ BÀI 3: QUẢN LÝ SẢN PHẨM (CRUD) ---
  getProducts(): Observable<any> {
    return this.http.get(`${this.productApiUrl}/products`, { headers: this.getHeaders() });
  }

  addProduct(product: any): Observable<any> {
    return this.http.post(`${this.productApiUrl}/products`, product, { headers: this.getHeaders() });
  }

  updateProduct(id: number, product: any): Observable<any> {
    return this.http.put(`${this.productApiUrl}/products/${id}`, product, { headers: this.getHeaders() });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.productApiUrl}/products/${id}`, { headers: this.getHeaders() });
  }
}