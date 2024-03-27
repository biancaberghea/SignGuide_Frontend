import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private backendUrl = 'http://127.0.0.1:5000';

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }


  getCatName() {
    return this.http.get(`${this.backendUrl}/getCategories`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.cats;
      })
    )
  }

  searchWord(word: string) {
    return this.http.get(`${this.backendUrl}/searchWord?word=${word}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.url;
      }));
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
