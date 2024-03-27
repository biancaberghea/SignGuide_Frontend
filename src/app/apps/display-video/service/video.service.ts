import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private backendUrl = 'http://127.0.0.1:5000';

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }

  getCatContent(catName: string) {
    return this.http.get(`${this.backendUrl}/getDataForCategory?category=${catName}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.cat_content;
      })
    )
  }

  getVideoId(word: any) {
    return this.http.get(`${this.backendUrl}/getVideoId?word=${word}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.video_id;
      })
    )
  }

  async checkUrl(url: any) {
    return await this.http.get(`${"http://127.0.0.1:5000"}/check-url?url=${url}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.allowEmbed;
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
