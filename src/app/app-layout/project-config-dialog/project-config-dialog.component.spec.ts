import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectConfigDialogComponent } from './project-config-dialog.component';

describe('ProjectConfigDialogComponent', () => {
  let component: ProjectConfigDialogComponent;
  let fixture: ComponentFixture<ProjectConfigDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectConfigDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectConfigDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
