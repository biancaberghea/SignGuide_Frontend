import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, from, throwError } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth/service/auth.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService,
    private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      headers: req.headers.set('Authorization',
        localStorage.getItem('accessToken') ?? ``),
        withCredentials: true
  });

    return next.handle(req).pipe(catchError((error: HttpErrorResponse) => {
      if (error.status == 403 && this.auth.isAuthenticated()) {
        return this.refreshTokenMethod(req, next);
      }
      return throwError('');

    })
    );

  }

  refreshTokenMethod(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return new Observable(observer => {
      this.auth.refreshToken().subscribe(
        (response: any) => {
          if (sessionStorage.getItem('accessToken')) {
            sessionStorage.removeItem('accessToken');
          }
          sessionStorage.setItem('accessToken', response);

          request = request.clone({
            headers: request.headers.set(
              'Authorization',
              sessionStorage.getItem('accessToken') ?? ``
            )
          });

          next.handle(request).subscribe(
            (event: HttpEvent<any>) => observer.next(event),
            (error: any) => {
              if (error.status == 403) {
                this.auth.logout();
              }
              observer.error(error);
            }
          );
        },
        (error: any) => observer.error(error)
      );
    });
  }

}
