import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyDiagramComponent } from './dependency-diagram.component';

describe('DependencyDiagramComponent', () => {
  let component: DependencyDiagramComponent;
  let fixture: ComponentFixture<DependencyDiagramComponent>;

  beforeEach(async(() => {
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
