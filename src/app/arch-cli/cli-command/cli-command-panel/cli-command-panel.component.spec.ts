import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CliCommandPanelComponent } from './cli-command-panel.component';

describe('CliCommandPanelComponent', () => {
  let component: CliCommandPanelComponent;
  let fixture: ComponentFixture<CliCommandPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CliCommandPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliCommandPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
