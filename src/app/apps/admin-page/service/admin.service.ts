import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, map, retry, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private backendUrl = 'http://127.0.0.1:5000';

  constructor(
    private http: HttpClient,
    private router: Router,

  ) { }



  loadData(pageNr: number, pageSize: number) {
    return this.http.get(`${"http://127.0.0.1:5000"}/load-items?pageNr=${pageNr}&pageSize=${pageSize}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.items;
      }));
  }

  getItemsLen() {
    return this.http.get(`${this.backendUrl}/getItemsLen`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        console.log(response)
        return response.len;
      }));
  }

  editItem(item: any, new_item: any) {
    return this.http.post(`${this.backendUrl}/editItem`, { item, new_item }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => { response }));
  }

  deleteItem(item: any) {
    return this.http.post(`${this.backendUrl}/deleteItem`, { item }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => { response }));
  }

  addItem(item: any) {
    return this.http.post(`${this.backendUrl}/addItem`, { item }, { withCredentials: true }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map(response => { response }));
  }

  searchItem(searchText: any) {
    return this.http.get(`${this.backendUrl}/searchItem?searchText=${searchText}`).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error)),
      map((response: any) => {
        return response.items;
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
