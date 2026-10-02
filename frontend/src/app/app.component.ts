import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="padding: 30px; font-family: Arial;">
      <h1>Bài thực hành SOA: Router, Middleware & JWT</h1>
      
      <h3>1. Dịch vụ Đăng nhập & Xác thực</h3>
      <input [(ngModel)]="username" placeholder="Tên đăng nhập" style="padding: 5px; margin-right: 10px;" />
      <input [(ngModel)]="password" type="password" placeholder="Mật khẩu" style="padding: 5px; margin-right: 10px;" />
      <button (click)="onLogin()" style="padding: 5px 10px; cursor: pointer;">Đăng nhập lấy Token</button>
      
      <p style="color: blue;"><strong>Trạng thái:</strong> {{ loginMessage }}</p>
      <p *ngIf="token" style="background: #eee; padding: 10px; word-break: break-all;"><strong>JWT:</strong> {{ token }}</p>

      <hr style="margin: 20px 0;"/>

      <h3>2. Dịch vụ in "Hello World" (Yêu cầu JWT)</h3>
      <button (click)="onTestApi()" style="padding: 5px 10px; cursor: pointer;">Gọi API /hello</button>
      <p style="color: green; font-size: 18px;"><strong>Kết quả API:</strong> {{ apiMessage }}</p>
    </div>
  `
})
export class AppComponent {
  username = 'admin';
  password = '123456'; 
  loginMessage = 'Chưa đăng nhập';
  apiMessage = '';
  token = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loginMessage = res.message;
        this.token = res.token;
        this.authService.saveToken(res.token);
      },
      error: (err) => {
        this.loginMessage = 'Lỗi: ' + (err.error?.message || 'Từ chối kết nối');
      }
    });
  }

  onTestApi() {
    this.authService.testHelloApi().subscribe({
      next: (res) => this.apiMessage = res,
      error: (err) => this.apiMessage = 'Lỗi truy cập (401/403): ' + (err.error?.message || 'Từ chối do thiếu Token')
    });
  }
}