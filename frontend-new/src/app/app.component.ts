import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div style="padding: 25px; font-family: Arial; max-width: 950px; margin: auto;">
      <h1>Hệ thống SOA: Auth Service (3000) & Product Service (3001)</h1>
      
      <!-- PHẦN 1: ĐĂNG NHẬP (BÀI 2) -->
      <div style="background: #f4f6f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
        <h3>1. Dịch vụ Xác thực (Cổng 3000)</h3>
        <input [(ngModel)]="username" placeholder="Tên đăng nhập" style="padding: 6px; margin-right: 10px;" />
        <input [(ngModel)]="password" type="password" placeholder="Mật khẩu" style="padding: 6px; margin-right: 10px;" />
        <button (click)="onLogin()" style="padding: 6px 12px; cursor: pointer;">Đăng nhập lấy JWT</button>
        <p style="margin: 8px 0 0 0; color: blue;"><strong>Trạng thái:</strong> {{ loginMessage }}</p>
      </div>

      <!-- PHẦN 2: QUẢN LÝ SẢN PHẨM (BÀI 3) -->
      <div style="border: 1px solid #ccc; padding: 15px; border-radius: 6px;">
        <h3>2. Dịch vụ Quản lý Sản phẩm (Cổng 3001)</h3>
        
        <!-- Form Thêm / Cập nhật -->
        <div style="margin-bottom: 15px; display: flex; gap: 8px; flex-wrap: wrap;">
          <input [(ngModel)]="productForm.name" placeholder="Tên sản phẩm" style="padding: 6px;" />
          <input [(ngModel)]="productForm.description" placeholder="Mô tả" style="padding: 6px;" />
          <input [(ngModel)]="productForm.price" type="number" placeholder="Giá" style="padding: 6px; width: 120px;" />
          <input [(ngModel)]="productForm.quantity" type="number" placeholder="Số lượng" style="padding: 6px; width: 90px;" />
          
          <button *ngIf="!editingId" (click)="onSaveProduct()" style="padding: 6px 12px; background: #28a745; color: white; border: none; cursor: pointer;">+ Thêm mới</button>
          <button *ngIf="editingId" (click)="onUpdateProduct()" style="padding: 6px 12px; background: #ffc107; border: none; cursor: pointer;">Lưu cập nhật (ID: {{editingId}})</button>
          <button *ngIf="editingId" (click)="resetForm()" style="padding: 6px 12px; cursor: pointer;">Hủy</button>
        </div>

        <button (click)="loadProducts()" style="padding: 6px 12px; margin-bottom: 10px; cursor: pointer;">🔄 Tải danh sách sản phẩm (GET /products)</button>
        <p *ngIf="productMessage" style="color: #d9534f; font-weight: bold;">{{ productMessage }}</p>

        <!-- Bảng hiển thị dữ liệu -->
        <table border="1" cellpadding="8" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead style="background: #e9ecef;">
            <tr>
              <th>ID</th>
              <th>Tên sản phẩm</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Số lượng</th>
              <th>Cập nhật lần cuối</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of products">
              <td>{{ p.id }}</td>
              <td>{{ p.name }}</td>
              <td>{{ p.description }}</td>
              <td>{{ p.price | number }} đ</td>
              <td>{{ p.quantity }}</td>
              <td>{{ p.updated_at | date:'short' }}</td>
              <td>
                <button (click)="onEditClick(p)" style="margin-right: 5px; cursor: pointer;">Sửa</button>
                <button (click)="onDeleteProduct(p.id)" style="color: red; cursor: pointer;">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AppComponent {
  username = 'admin';
  password = '123456'; 
  loginMessage = 'Chưa đăng nhập';
  productMessage = '';
  
  products: any[] = [];
  editingId: number | null = null;
  productForm = { name: '', description: '', price: 0, quantity: 0 };

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe({
      next: (res: any) => {
        this.loginMessage = res.message + ' (Đã lưu Token)';
        this.authService.saveToken(res.token);
        this.loadProducts(); // Tự động tải danh sách sản phẩm sau khi đăng nhập
      },
      error: (err: any) => {
        this.loginMessage = 'Lỗi: ' + (err.error?.message || 'Không kết nối được cổng 3000');
      }
    });
  }

  loadProducts() {
    this.authService.getProducts().subscribe({
      next: (res: any) => {
        this.products = res;
        this.productMessage = '';
      },
      error: (err: any) => {
        this.productMessage = 'Lỗi truy cập (401/403): ' + (err.error?.message || 'Vui lòng đăng nhập trước!');
      }
    });
  }

  onSaveProduct() {
    this.authService.addProduct(this.productForm).subscribe({
      next: () => {
        this.loadProducts();
        this.resetForm();
      },
      error: (err: any) => this.productMessage = err.error?.message || 'Lỗi khi thêm sản phẩm'
    });
  }

  onEditClick(product: any) {
    this.editingId = product.id;
    this.productForm = { 
      name: product.name, 
      description: product.description, 
      price: product.price, 
      quantity: product.quantity 
    };
  }

  onUpdateProduct() {
    if (!this.editingId) return;
    this.authService.updateProduct(this.editingId, this.productForm).subscribe({
      next: () => {
        this.loadProducts();
        this.resetForm();
      },
      error: (err: any) => this.productMessage = err.error?.message || 'Lỗi khi cập nhật'
    });
  }

  onDeleteProduct(id: number) {
    this.authService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err: any) => this.productMessage = err.error?.message || 'Lỗi khi xóa'
    });
  }

  resetForm() {
    this.editingId = null;
    this.productForm = { name: '', description: '', price: 0, quantity: 0 };
  }
}