import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PonentSummaryComponent } from './ponent-summary.component';

describe('PonentSummaryComponent', () => {
  let component: PonentSummaryComponent;
  let fixture: ComponentFixture<PonentSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PonentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
