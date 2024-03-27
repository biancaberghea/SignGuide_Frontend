import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Note } from '../model/note';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private backendUrl = 'http://127.0.0.1:5000';

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }

  addNote(title:string, content:string, user_id: any) {
    return this.http.post(`${this.backendUrl}/addNotes`, { title, content, user_id }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))).
      subscribe(response => { console.log(response) });
  }

  getNotes(user_id: any) {
    return this.http.get(`${this.backendUrl}/getNotes?user_id=${user_id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => { return response.notes }));
  }

  deleteNote(user_id: any, note: any) {
    return this.http.post(`${this.backendUrl}/deleteNote`, { note, user_id }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => { response }));
  }

  editNote(user_id: any, note: any, ex_note: any) {
    return this.http.post(`${this.backendUrl}/editNote`, { note, user_id, ex_note }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => { response }));
  }

  updateLearnProgress(user_id: any, video_id: any) {
    return this.http.post(`${this.backendUrl}/updateLearnProgress`, { user_id, video_id }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => { response }));
  }

  getLearnPercent(user_id: any) {
    return this.http.get(`${this.backendUrl}/getLearnPercent?user_id=${user_id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => { return response.progress }));
  }

  getQuizPercent(user_id: any) {
    return this.http.get(`${this.backendUrl}/getQuizPercent?user_id=${user_id}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => { return response.progress }));
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
