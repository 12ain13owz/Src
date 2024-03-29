import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token: string;
  private tokenTimer: ReturnType<typeof setTimeout>;
  private isAuthenticated: boolean = false;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    return this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };

    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expireDuration = response.expiresIn;
            this.setAuthTimer(expireDuration);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expireDuration * 1000
            );

            this.isAuthenticated = true;
            this.authStatusListener.next(this.isAuthenticated);
            this.userId = response.userId;
            this.saveAuthData(token, expirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoLogin() {
    const authInformation = this.getAuthData();
    if (!authInformation) return;

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.setAuthTimer(expiresIn / 1000);
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.authStatusListener.next(this.isAuthenticated);
    }
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.token = null;
    this.userId = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(['/login']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');

    if (!token || !expiration) return null;

    return {
      token: token,
      expirationDate: new Date(expiration),
      userId: userId,
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
