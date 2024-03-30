import { ComponentFixture, TestBed } from '@angular/core/testing';

import { bookComponent } from './book.component';

describe('bookComponent', () => {
  let component: bookComponent;
  let fixture: ComponentFixture<bookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ bookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(bookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
