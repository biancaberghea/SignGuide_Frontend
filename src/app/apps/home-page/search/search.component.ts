import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CategoriesService } from '../service/categories.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  word: string = '';
  url: any = '';

  constructor(private catService: CategoriesService,
    private router: Router,
    private sanitizer: DomSanitizer) { }

  search(word: string) {
    this.catService.searchWord(word).subscribe(response => {
      this.word = word;
      if (response == 'Could not find word') {
        this.url = null;
      }
      else {
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(response);
      }
    });
  }

}
