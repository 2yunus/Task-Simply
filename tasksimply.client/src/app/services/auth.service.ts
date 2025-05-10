import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  username?: string;
  role?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => {
        if (response.success) {
          this.setCurrentUser(response);
          this.router.navigate(['/tasks']);
        }
      }),
      catchError(this.handleError)
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        if (response.success) {
          this.setCurrentUser(response);
          this.router.navigate(['/tasks']);
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private setCurrentUser(user: AuthResponse): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    const user = this.currentUserSubject.value;
    return user?.token || null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 400) {
        if (error.error?.errors?.Username) {
          errorMessage = 'Username is already taken';
        } else if (error.error?.errors?.Email) {
          errorMessage = 'Email is already registered';
        } else if (error.error?.errors?.Password) {
          errorMessage = 'Password does not meet requirements';
        } else {
          errorMessage = error.error?.message || 'Invalid registration data';
        }
      } else if (error.status === 0) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
    }
    
    return throwError(() => ({
      status: error.status,
      message: errorMessage,
      errors: error.error?.errors
    }));
  }
} 