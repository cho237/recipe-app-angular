import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
  id: string;
  email: string;
  expiresIn: string;
  idToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:5000/auth/signup', {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) =>
          this.handleAuthentification(
            resData.email,
            resData.id,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>('http://localhost:5000/auth/login', {
        email: email,
        password: password,
      })
      .pipe(
        catchError(this.handleError),
        tap((resData) =>
          this.handleAuthentification(
            resData.email,
            resData.id,
            resData.idToken,
            +resData.expiresIn
          )
        )
      );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentification(
    email: string,
    userId: string,
    token: string,
    expiresIn: number
  ) {
    const expiresDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expiresDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'Something went wrong.';
    if (!errorRes.error || !errorRes.error.message) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.message) {
      case 'email_exist':
        errorMessage = 'This email already exist.';
        break;
      case 'weak_password':
        errorMessage = 'Weak password.';
        break;
      case 'user_not_found':
        errorMessage = 'This email does not exist.';
        break;
      case 'wrong_password':
        errorMessage = 'Incorrect password.';
        break;
    }
    return throwError(() => errorMessage);
  }
}
