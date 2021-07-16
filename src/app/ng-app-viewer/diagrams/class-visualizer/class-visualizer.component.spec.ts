import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassVisualizerComponent } from './class-visualizer.component';

describe('ClassVisualizerComponent', () => {
  let component: ClassVisualizerComponent;
  let fixture: ComponentFixture<ClassVisualizerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassVisualizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassVisualizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
