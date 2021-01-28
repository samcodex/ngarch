import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PonentSummaryComponent } from './ponent-summary.component';

describe('PonentSummaryComponent', () => {
  let component: PonentSummaryComponent;
  let fixture: ComponentFixture<PonentSummaryComponent>;

  beforeEach(async(() => {
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
