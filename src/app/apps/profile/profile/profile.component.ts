import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { ProfileService } from '../service/profile.service';
import { VideoProfileService } from '../../shared_service/video-profile.service';
import { NoteService } from '../../shared_service/note.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentIdx: number = 0;
  currentPageIdx: number = 1;
  userNotes: { [key: string]: string } = {};
  selectedNote: string | null = null;
  userId: any = 0;
  isEditing: boolean = false;
  editTitle: string = '';
  editContent: string = '';
  learnPercent: any = 0;
  quizPercent: any = 0;
  username: string = '';


  constructor(private profileService: ProfileService,
    private authService: AuthService,
    private videoProfileService: VideoProfileService,
    private noteService: NoteService) { }

  ngOnInit() {

    this.authService.getUserId().subscribe(response => {
      this.userId = response

      this.loadNotes();

      this.getNotes(this.currentIdx);

      this.getLearnPercent();
      this.getQuizPercent();
      this.getUsername();
    });

    this.videoProfileService.videoId$.subscribe(videoId => {
      this.profileService.updateLearnProgress(this.userId, videoId).subscribe(() => { });
    })

    this.noteService.note$.subscribe(note => {
      this.profileService.addNote(note.title, note.content, this.userId);
    })

  }

  private getUsername() {
    this.username=this.authService.getUsername();
  }

  private loadNotes() {
    this.profileService.getNotes(this.userId).subscribe(response => this.userNotes = response);
  }

  isFirstPage() {
    return this.currentPageIdx == 1;
  }

  isLastPage() {
    if (Math.ceil((Object.keys(this.userNotes).length) / 7) == 0) {
      return true
    }
    else {
      return this.currentPageIdx == Math.ceil((Object.keys(this.userNotes).length) / 7);
    }

  }

  nextPage() {
    var arrLen = Object.keys(this.userNotes).length as number;
    this.currentIdx = Math.min(this.currentIdx + 7, arrLen);
    this.currentPageIdx++;
    this.getNotes(this.currentIdx);
  }

  prevPage() {
    this.currentIdx = Math.max(this.currentIdx - 7, 0);
    this.currentPageIdx--;
    this.getNotes(this.currentIdx);
  }

  getNotes(idx: number): any[] {
    var startIdx = idx;
    var arrLen = Object.keys(this.userNotes).length as number;
    var endIdx = Math.min(startIdx + 7, arrLen)


    return Object.keys(this.userNotes).slice(startIdx, endIdx);
  }

  deleteNote() {
    this.profileService.deleteNote(this.userId, this.selectedNote).subscribe(() => {
      this.loadNotes();
      this.selectedNote = null;
    });;
  }

  editNote() {
    this.isEditing = true;
    if (this.selectedNote) {
      this.editTitle = this.selectedNote;
      this.editContent = this.userNotes[this.editTitle];
    }
  }

  saveEdit() {
    var note: { [key: string]: string } = {};
    note[this.editTitle] = this.editContent;

    this.profileService.editNote(this.userId, note, this.selectedNote).subscribe(() => {
      this.isEditing = false;
      this.selectedNote = null;
      this.loadNotes();
    });
  }

  getLearnPercent() {
    this.profileService.getLearnPercent(this.userId).subscribe(response => this.learnPercent = response);
  }

  getQuizPercent() {
    this.profileService.getQuizPercent(this.userId).subscribe(response => this.quizPercent = response);
  }


}
