import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActivityDiagramComponent } from './activity-diagram.component';

describe('ActivityDiagramComponent', () => {
  let component: ActivityDiagramComponent;
  let fixture: ComponentFixture<ActivityDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
