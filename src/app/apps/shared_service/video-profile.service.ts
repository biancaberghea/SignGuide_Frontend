import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VideoProfileService {
  private videoIdSubject = new BehaviorSubject<any>('');
  videoId$: Observable<any> = this.videoIdSubject.asObservable();

  constructor() { }

  setVideoId(id: any): void {
    this.videoIdSubject.next(id);
  }
}
