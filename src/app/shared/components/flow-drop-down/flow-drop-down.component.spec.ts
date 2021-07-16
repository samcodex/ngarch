import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FlowDropDownComponent } from './flow-drop-down.component';

describe('FlowDropDownComponent', () => {
  let component: FlowDropDownComponent;
  let fixture: ComponentFixture<FlowDropDownComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowDropDownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
