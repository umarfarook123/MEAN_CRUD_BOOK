import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { bookmodel } from '../Model/bookmodel';
import { PopupComponent } from '../popup/popup.component';
import { ApiService } from '../shared/api.service';
import * as alertify from 'alertifyjs'
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator ,PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, fromEvent } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class bookComponent implements OnInit {

  constructor(private dialog: MatDialog, private api: ApiService) { }
  @ViewChild(MatPaginator) _paginator!:MatPaginator;
  @ViewChild(MatSort) _sort!:MatSort;
  bookdata!: bookmodel[];
  finaldata:any;
  responsedata:any;
  searchKey: string = '';
  currentPage: number = 0;
  pageSize: number = 5; // Set your desired page size here
  totalItems: number = 0;
  ngOnInit(): void {
    this.LoadBook();
    this.setupSearch()
  }

  displayColums: string[] = ["ISBN", "title", "author","action"]

  Openpopup(ISBN: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        ISBN: ISBN
      }
    })
    _popup.afterClosed().subscribe(r => {
      this.LoadBook();
    });
  }

  LoadBook(pageIndex: number = 0, pageSize: number = 5) {
    const params = { page: pageIndex, pageSize, searchKey: this.searchKey };
    this.api.GetAllBook(params).subscribe(response => {
      this.responsedata = response;
      this.bookdata = this.responsedata.data;
      this.totalItems = this.responsedata.count;
      
      this.finaldata=new MatTableDataSource<bookmodel>(this.bookdata);
      this.finaldata.paginator=this._paginator;
      this.finaldata.sort=this._sort;
    });
  }

  EditBook(ISBN: any) {
    this.Openpopup(ISBN);
  }
  RemoveBook(ISBN: any) {
    alertify.confirm("Remove BOOK", "do you want remove this book?", () => {
      this.api.RemoveBook({ISBN}).subscribe(r => {
        this.LoadBook();
      });
    }, function () {

    })


  }
  onPageChange(event: PageEvent) {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.LoadBook(pageIndex, pageSize);
  }

  setupSearch(): void {
    fromEvent(document.getElementById('searchInput')!, 'keyup')
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.searchKey = (document.getElementById('searchInput') as HTMLInputElement).value.trim();
        this._paginator.firstPage();
        this.LoadBook();
      });
  }
}
