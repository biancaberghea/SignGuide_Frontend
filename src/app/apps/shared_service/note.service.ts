import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Note } from '../profile/model/note';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private noteSubject = new BehaviorSubject<Note>(new Note('', ''));
  note$: Observable<any> = this.noteSubject.asObservable();

  constructor() { }

  setNote(note: Note): void {
    this.noteSubject.next(note);
  }
}
