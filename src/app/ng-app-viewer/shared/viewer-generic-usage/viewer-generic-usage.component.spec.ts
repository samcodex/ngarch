import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewerGenericUsageComponent } from './viewer-generic-usage.component';

describe('ViewerGenericUsageComponent', () => {
  let component: ViewerGenericUsageComponent;
  let fixture: ComponentFixture<ViewerGenericUsageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerGenericUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerGenericUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
