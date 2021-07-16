import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgAppViewerComponent } from './ng-app-viewer.component';

describe('NgAppViewerComponent', () => {
  let component: NgAppViewerComponent;
  let fixture: ComponentFixture<NgAppViewerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgAppViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgAppViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
