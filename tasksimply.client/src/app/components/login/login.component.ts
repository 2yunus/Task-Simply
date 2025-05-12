import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  template: `
    <div class="container">
      <div class="row justify-content-center align-items-center min-vh-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card shadow-lg border-0 rounded-lg">
            <div class="card-header bg-primary text-white text-center py-4">
              <h3 class="mb-0">Welcome Back</h3>
              <p class="mb-0">Sign in to TaskSimply</p>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="form-floating mb-4">
                  <input type="text" class="form-control" id="username" formControlName="username" placeholder="Username">
                  <label for="username">Username</label>
                  <div class="text-danger mt-1" *ngIf="loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched">
                    Username is required
                  </div>
                </div>

                <div class="form-floating mb-4">
                  <input type="password" class="form-control" id="password" formControlName="password" placeholder="Password">
                  <label for="password">Password</label>
                  <div class="text-danger mt-1" *ngIf="loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched">
                    Password is required
                  </div>
                </div>

                <div class="alert alert-danger" *ngIf="errorMessage">
                  {{ errorMessage }}
                </div>

                <div class="d-grid gap-2">
                  <button class="btn btn-primary btn-lg" type="submit" [disabled]="!loginForm.valid || isLoading">
                    <span class="spinner-border spinner-border-sm me-2" *ngIf="isLoading" role="status" aria-hidden="true"></span>
                    {{ isLoading ? 'Signing in...' : 'Sign In' }}
                  </button>
                </div>
              </form>
            </div>
            <div class="card-footer text-center py-3">
              <div class="small">
                Don't have an account? <a routerLink="/register" class="text-primary">Register here</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border-radius: 1rem;
    }
    .card-header {
      border-top-left-radius: 1rem !important;
      border-top-right-radius: 1rem !important;
    }
    .form-floating {
      position: relative;
      margin-bottom: 1.5rem;
    }
    .form-floating > .form-control {
      height: calc(3.5rem + 2px);
      padding: 1rem 0.75rem;
      line-height: 1.25;
    }
    .form-floating > label {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      padding: 1rem 0.75rem;
      pointer-events: none;
      border: 1px solid transparent;
      transform-origin: 0 0;
      transition: opacity .1s ease-in-out, transform .1s ease-in-out;
      z-index: 1;
    }
    .form-floating > .form-control:focus ~ label,
    .form-floating > .form-control:not(:placeholder-shown) ~ label {
      color: #2196F3;
      transform: scale(.85) translateY(-1rem) translateX(0.15rem);
      background-color: white;
      padding: 0 0.5rem;
      height: auto;
      z-index: 2;
    }
    .text-danger {
      position: absolute;
      bottom: -1.5rem;
      left: 0;
      font-size: 0.875rem;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/tasks']);
          } else {
            this.errorMessage = response.message || 'Login failed. Please try again.';
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'An error occurred during login. Please try again.';
          this.isLoading = false;
        },
        complete: () => {
          if (this.isLoading) {
            this.isLoading = false;
          }
        }
      });
    }
  }
} 