import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DependencyDiagramComponent } from './dependency-diagram.component';

describe('DependencyDiagramComponent', () => {
  let component: DependencyDiagramComponent;
  let fixture: ComponentFixture<DependencyDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DependencyDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DependencyDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
