import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../shared/api.service';
import * as alertify from 'alertifyjs'

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})



export class PopupComponent implements OnInit {
  editdata: any;
  resp: any;
  constructor(private builder: FormBuilder, private dialog: MatDialog, private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data.ISBN != true )
    if (this.data.ISBN != '' && this.data.ISBN != null) {
      this.api.GetBookSingle({ISBN:this.data.ISBN}).subscribe(response => {
        console.log(response)
        
        this.resp = response;
        this.editdata = this.resp.data;
        this.bookform.setValue({
          ISBN: this.editdata.ISBN, title: this.editdata.title, author: this.editdata.author,
          pubYear: this.editdata.pubYear, description: this.editdata.description,_id:this.editdata._id
        });
      });
    }
    else
    {
      console.log("sjsk")
    }
  }

  



  bookform = this.builder.group({
   
    ISBN: [{value: this.data.ISBN || '', disabled: !!this.data.ISBN}, [Validators.required, Validators.pattern(/^\d{16}$/)]],
 
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(18)]],
    author: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(18)]],
    pubYear: ['', [Validators.required, Validators.pattern(/^(19|20)\d{2}$/)]],
    description: ['', Validators.required],
    _id: [this.data._id || ''], 
  });
  

  SaveBook() {
    console.log(this.bookform.value)

    if (this.bookform.valid) {
      const Editid = this.bookform.getRawValue()._id;
      if (Editid != '' && Editid != null) {
        this.api.UpdateBook(this.bookform.getRawValue()).subscribe(response => {
          
          this.resp = response;
          if (!this.resp.status) {
            alertify.error(this.resp.message)
          }
          else {
            this.closepopup();

            alertify.success(this.resp.message)

          }
        });
      } else {
        this.api.CreateBook(this.bookform.value).subscribe(response => {
          this.resp = response;
          if (!this.resp.status) {
            alertify.error(this.resp.message)
          }
          else {
            this.closepopup();

            alertify.success(this.resp.message)

          }
        });
      }
    }
  }

  closepopup() {
    this.dialog.closeAll();
  }

}
