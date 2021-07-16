import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppArchViewerComponent } from './app-arch-viewer.component';

describe('AppArchViewerComponent', () => {
  let component: AppArchViewerComponent;
  let fixture: ComponentFixture<AppArchViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppArchViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppArchViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
