import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, catchError, map, mergeMap, tap, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backendUrl = 'http://127.0.0.1:5000';
  private jwt: JwtHelperService = new JwtHelperService();
  private authStatus: BehaviorSubject<boolean> = new BehaviorSubject(this.isAuthenticated());


  constructor(private http: HttpClient) { }

  subscribe(next: (status: boolean) => void) {
    this.authStatus.subscribe(next);
  }

  signup(userData: any) {
    return this.http.post(`${this.backendUrl}/signup`, userData, { withCredentials: true })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response:any) => {
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);
      }));
  }

  login(userData: any) {
    return this.http.post(`${this.backendUrl}/loginUser`, userData, { withCredentials: true })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)),
        map((response: any) => {
          localStorage.setItem('accessToken', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);
        })
      );
  }

  logout() {
    localStorage.clear();
    this.authStatus.next(false);
  }

  getAccessToken(){
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!this.jwt.isTokenExpired(accessToken)) {
      return new BehaviorSubject(accessToken);
    }
    else if (!this.jwt.isTokenExpired(refreshToken)) {
      const opts = {
          headers: new HttpHeaders({
          Authorization: 'Bearer ' + refreshToken
        })
      };

      return this.http.post(`${this.backendUrl}/refreshToken`, {}, opts).pipe(
        map((response:any) => {
          localStorage.setItem('accessToken', response.access_token);
          return response.access_token;
        })
      );
    }
    else {
      return throwError('refresh token is expired');
    }
  }

  refreshToken() {

    return this.http.post(`${this.backendUrl}/refreshToken`, {}).pipe(
      map((response: any) => {
        localStorage.setItem('accessToken', response.access_token);
        return response.access_token;
      })
    );
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: string }>(token);

        if (decoded) {
          return decoded.sub != null && !this.jwt.isTokenExpired(localStorage.getItem('refreshToken'));
        }
        else {
          console.error('Invalid username');
          return false;
        }
      }
      catch (error) {
        console.error('Error decoding token:', error);
        return false;
      }

    }
    else {
      return false;
    }
  }


  getUsername():string {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: string }>(token);

        if (decoded) {
          return decoded.sub;
        }
        else {
          console.error('Invalid username');
          return '';
        }
      }
      catch (error) {
        console.error('Error decoding token:', error);
        return '';
      }

    }
    else {
      console.error('Token not found in localStorage');
      return '';
    }
  }


  getUserId() {
    return this.http.get(`${this.backendUrl}/getUserID`, { withCredentials: true })
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)),
        map((response: any) => { return response.id; }))
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError('Something bad happened; please try again later.');
  }
}
