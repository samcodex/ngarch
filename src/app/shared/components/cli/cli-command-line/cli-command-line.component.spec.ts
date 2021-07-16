import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CliCommandLineComponent } from './cli-command-line.component';

describe('CliCommandLineComponent', () => {
  let component: CliCommandLineComponent;
  let fixture: ComponentFixture<CliCommandLineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CliCommandLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliCommandLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
