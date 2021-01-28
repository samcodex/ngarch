import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLoaderOverlayComponent } from './project-loader-overlay.component';

describe('ProjectLoaderOverlayComponent', () => {
  let component: ProjectLoaderOverlayComponent;
  let fixture: ComponentFixture<ProjectLoaderOverlayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectLoaderOverlayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectLoaderOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
