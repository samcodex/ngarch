import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewerTerminalComponent } from './viewer-terminal.component';

describe('ViewerTerminalComponent', () => {
  let component: ViewerTerminalComponent;
  let fixture: ComponentFixture<ViewerTerminalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerTerminalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerTerminalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
