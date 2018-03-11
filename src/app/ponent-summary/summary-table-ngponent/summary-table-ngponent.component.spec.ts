import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryTableNgponentComponent } from './summary-table-ngponent.component';

describe('SummaryTableNgponentComponent', () => {
  let component: SummaryTableNgponentComponent;
  let fixture: ComponentFixture<SummaryTableNgponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummaryTableNgponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryTableNgponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
