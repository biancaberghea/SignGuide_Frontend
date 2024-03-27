import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from '../model/items';
import { AdminService } from '../service/admin.service';


@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent {
  items: MatTableDataSource<Item> = new MatTableDataSource<Item>();
  itemList: Item[] = [];
  columns = ['Word', 'URL', 'Category'];
  pageNr = 1;
  pageSize = 10;
  editingItem: any = null;
  word: any = '';
  url: any = '';
  cat: any = '';
  searchText: string = '';
  itemsLen: number = 0;

  constructor(private adminService: AdminService) { }

  search(pageNr: number, searchText: any) {
    this.searchText = searchText;
    this.adminService.searchItem(this.searchText).subscribe(response => {


      this.itemList = response;
      this.itemsLen = this.itemList.length;
      this.loadItems(pageNr);
    })
  }

  loadItems(pageNr: number) {
    const startIndex = (pageNr - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    const itemsForPage = this.itemList.slice(startIndex, endIndex);
    this.items = new MatTableDataSource<Item>(itemsForPage);
  }

  edit(item: any) {
    this.editingItem = item;
    if (item.word != '' && item.url != '' && item.cat != '') {
      this.word = item.word;
      this.cat = item.cat;
      this.url = item.url;
    }

  }

  saveEdit() {
    var new_item: { [key: string]: string[] } = {};
    new_item[this.word] = [this.url, this.cat]
    console.log(new_item);
    this.adminService.editItem(this.editingItem, new_item).subscribe(() => {
      this.search(this.pageNr, this.searchText);

      this.editingItem = null;
      this.word = null;
      this.url = null;
      this.cat = null;
    });


  }

  deleteItem() {
    this.adminService.deleteItem(this.editingItem).subscribe(() => {
      this.search(this.pageNr, this.searchText);
    });
    this.editingItem = null
    this.word = null;
    this.url = null;
    this.cat = null;

  }
}
