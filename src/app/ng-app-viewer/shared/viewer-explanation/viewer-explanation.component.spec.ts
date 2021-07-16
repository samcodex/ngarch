import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewerExplanationComponent } from './viewer-explanation.component';

describe('ViewerExplanationComponent', () => {
  let component: ViewerExplanationComponent;
  let fixture: ComponentFixture<ViewerExplanationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerExplanationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerExplanationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
