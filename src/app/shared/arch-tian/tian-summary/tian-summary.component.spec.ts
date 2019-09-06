import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TianSummaryComponent } from './tian-summary.component';

describe('TianSummaryComponent', () => {
  let component: TianSummaryComponent;
  let fixture: ComponentFixture<TianSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TianSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TianSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
