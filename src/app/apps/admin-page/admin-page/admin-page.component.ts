import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Item } from '../model/items';
import { AdminService } from '../service/admin.service';
import { MatTableDataSource } from '@angular/material/table';
import { SearchItemComponent } from '../search-item/search-item.component';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit{
  @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer!: ViewContainerRef;
  component: any;

  items: MatTableDataSource<Item> = new MatTableDataSource<Item>();
  itemList: Item[] = [];
  columns = ['Word', 'URL', 'Category'];
  pageNr = 1;
  pageSize = 10;
  itemsLen: number = 0;
  editingItem: any = null;
  word: any = '';
  url: any = '';
  cat: any = '';
  editing: string = '';
  searchText: string = '';

  constructor(private adminService: AdminService,
    private componentFactoryResolver: ComponentFactoryResolver) { }


  ngOnInit() {

    this.component = null;
    this.pageNr = 1;
    this.loadItems(this.pageNr);

    this.adminService.getItemsLen().subscribe(response => this.itemsLen = response)
  }
  
  loadItems(pageNr: number) {
    this.adminService.loadData(pageNr, this.pageSize).subscribe(response => {
      this.itemList = response;
      this.items = new MatTableDataSource<Item>(this.itemList);
    })
  }

 
  edit(item: any) {
    this.editingItem = item;
    if (item.word != '' && item.url != '' && item.cat != '') {
      this.word = item.word;
      this.cat = item.cat;
      this.url = item.url;

      this.editing = 'e';
    }
    else {
      this.editing = 'a';
    }

  }

  addItem() {
    const newRow = { "word": "", "url": "", "cat": "" }
    this.itemList = [newRow, ...this.itemList];
    this.items = new MatTableDataSource<Item>(this.itemList);
  }

  saveEdit() {

    if (this.editing == 'a') {
      var new_item: { [key: string]: string[] } = {};
      new_item[this.word] = [this.url, this.cat]
      this.adminService.addItem(new_item).subscribe(() => {
        this.loadItems(this.pageNr);
      });
    }

    else if (this.editing == 'e') {
      var new_item: { [key: string]: string[] } = {};
      new_item[this.word] = [this.url, this.cat]
      this.adminService.editItem(this.editingItem, new_item).subscribe(() => {
        this.loadItems(this.pageNr);
      });
    }

    this.editingItem = null;
    this.word = null;
    this.url = null;
    this.cat = null;
  }

  deleteItem() {
    if (this.editing == 'a') {
      console.log('Cant delete without all info');

      this.loadItems(this.pageNr);
    }
    else if (this.editing == 'e') {
      this.adminService.deleteItem(this.editingItem).subscribe(() => {
        this.loadItems(this.pageNr);
      });
    }
    this.editingItem = null
    this.word = null;
    this.url = null;
    this.cat = null;

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
        this.component = SearchItemComponent;
        break;
      default:
        break;
    }

    if (this.component) {
      setTimeout(() => {
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.component);
        const componentRef = this.contentContainer.createComponent(factory);

        const dynamicComponentInstance = componentRef.instance as SearchItemComponent;
        dynamicComponentInstance.search(1, this.searchText);

        this.searchText = '';

      });
    }
  }
}
