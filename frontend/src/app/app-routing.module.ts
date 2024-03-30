import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { bookComponent } from './book/book.component';

const routes: Routes = [
  {
    component:bookComponent,path:"book"
  },
  {
    component:bookComponent,path:""
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
