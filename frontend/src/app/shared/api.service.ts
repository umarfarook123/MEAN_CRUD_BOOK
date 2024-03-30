import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { bookmodel } from '../Model/bookmodel';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  apiurl = 'http://localhost:1234';

  GetAllBook(bookdata: any): Observable<bookmodel[]> {
    return this.http.post<bookmodel[]>(this.apiurl+'/book-lists',bookdata);
  }

  GetBookSingle(bookdata: any): Observable<bookmodel> {
    return this.http.post<bookmodel>(this.apiurl + '/get-single-book',bookdata );
  }

  RemoveBook(bookdata: any) {
    console.log(bookdata)
    return this.http.post(this.apiurl + '/delete-book' ,bookdata);
  }

  CreateBook(bookdata: any) {
    return this.http.post(this.apiurl+"/add-book", bookdata);
  }

  UpdateBook(bookdata: any) {
    return this.http.post(this.apiurl + '/update-book', bookdata);
  }

}
