import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CliExecutionComponent } from './cli-execution.component';

describe('CliExecutionComponent', () => {
  let component: CliExecutionComponent;
  let fixture: ComponentFixture<CliExecutionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CliExecutionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
