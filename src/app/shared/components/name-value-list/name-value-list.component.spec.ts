import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NameValueListComponent } from './name-value-list.component';

describe('NameValueListComponent', () => {
  let component: NameValueListComponent;
  let fixture: ComponentFixture<NameValueListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NameValueListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameValueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
