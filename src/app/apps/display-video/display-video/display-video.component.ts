import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../service/video.service';
import { AuthService } from '../../../auth/service/auth.service';
import { VideoProfileService } from '../../shared_service/video-profile.service';
import { NoteService } from '../../shared_service/note.service';
import { Note } from '../../profile/model/note';


@Component({
  selector: 'app-display-video',
  templateUrl: './display-video.component.html',
  styleUrls: ['./display-video.component.css']
})
export class DisplayVideoComponent implements OnInit {
  word: string = '';
  url: any;
  cat_name: string = '';
  content: { [key: string]: string } = {};
  currentVideoIdx: number = 0;
  allowEmbed: boolean = true;
  titleInput: string = '';
  contentInput: string = '';
  needRevision: boolean = false;


  constructor(private route: ActivatedRoute,
    private videoService: VideoService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private videoProfileService: VideoProfileService,
    private noteService: NoteService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.cat_name = params['catName'];
    });

    this.loadCatContent(this.cat_name);
  }

  private loadCatContent(catName: string) {
    this.videoService.getCatContent(catName).subscribe(response => {
      this.content = response
      this.showVideo(this.currentVideoIdx);
    });
  }

  private async showVideo(idx: number) {
    const entry: any = this.content[idx];
    await this.checkUrlAvailable(entry['url'])
    await this.checkUrlEmbedded(entry['url'])
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(entry['url']);
    this.word = entry['name'];
    this.currentVideoIdx = idx;

  }

  private async checkUrlEmbedded(url: any) {
    try {
      const response = await (await this.videoService.checkUrl(url)).toPromise();
      this.allowEmbed = response;
      if (!this.allowEmbed) {
        this.currentVideoIdx++;
        this.showVideo(this.currentVideoIdx);
      }
    } catch (error) {
      console.error('Error checking URL:', error);
    }

  }

  private async checkUrlAvailable(url: any) {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "no-cors"
    }).then(result => { return true }).catch(err => { return false });
  }

  nextVideo() {
    if (!this.needRevision) {
      this.updateProgress();
    }
    else {
      this.changeRevision();
    }

    this.showVideo(this.currentVideoIdx + 1);
    this.titleInput = '';
    this.contentInput = '';
  }

  private updateProgress() {
    var videoId = 0;
    this.videoService.getVideoId(this.word).subscribe(response => {
      videoId = response;
      this.videoProfileService.setVideoId(videoId)
    })

  }

  previousVideo() {
    this.showVideo(this.currentVideoIdx - 1);
    this.titleInput = '';
    this.contentInput = '';
  }

  isFirstVideo() {
    return this.currentVideoIdx == 0;
  }

  isLastVideo() {
    return this.currentVideoIdx == (Object.keys(this.content).length - 1) as any;
  }

  changeRevision() {
    this.needRevision = !this.needRevision
  }

  addNote() {
    var note = new Note(this.titleInput, this.contentInput);
    this.noteService.setNote(note);
    this.titleInput = '';
    this.contentInput = '';

  }
}

