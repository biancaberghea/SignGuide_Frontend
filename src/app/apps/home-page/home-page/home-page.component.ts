import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../utils/model/roles';
import { AuthService } from '../../../auth/service/auth.service';
import { CategoriesService } from '../service/categories.service';
import { SearchComponent } from '../search/search.component';


@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent {

  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  component: any;

  protected readonly Role = Role;

  cat_names: { [key: string]: string[] } = {};
  searchText: string = '';
  constructor(private catService: CategoriesService, private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.component = null;

    this.catService.getCatName().subscribe(response => {
      this.cat_names = response;
    });
  }


  changeContent(buttonType: string): void {
    if (this.component) {
      this.contentContainer.clear();
    }

    switch (buttonType) {
      case 'home':
        this.component = null;
        break;
      case 'search':
        this.component = SearchComponent;
        break;
      default:
        break;
    }

    if (this.component) {
      setTimeout(() => {
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.component);
        const componentRef = this.contentContainer.createComponent(factory);

        const dynamicComponentInstance = componentRef.instance as SearchComponent;
        dynamicComponentInstance.search(this.searchText);

        this.searchText = '';

      });
    }
  }

  navToCat(cat: string) {
    this.router.navigateByUrl(`/video/video/${cat}`);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login'])
  }
}
