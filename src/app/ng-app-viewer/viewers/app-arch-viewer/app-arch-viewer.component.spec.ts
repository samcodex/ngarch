import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppArchViewerComponent } from './app-arch-viewer.component';

describe('AppArchViewerComponent', () => {
  let component: AppArchViewerComponent;
  let fixture: ComponentFixture<AppArchViewerComponent>;

  beforeEach(async(() => {
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
