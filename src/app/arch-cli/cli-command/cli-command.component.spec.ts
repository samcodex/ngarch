import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CliCommandComponent } from './cli-command.component';

describe('CliCommandComponent', () => {
  let component: CliCommandComponent;
  let fixture: ComponentFixture<CliCommandComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CliCommandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliCommandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
