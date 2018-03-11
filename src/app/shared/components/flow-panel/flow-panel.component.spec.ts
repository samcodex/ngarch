import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPanelComponent } from './flow-panel.component';

describe('FlowPanelComponent', () => {
  let component: FlowPanelComponent;
  let fixture: ComponentFixture<FlowPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
