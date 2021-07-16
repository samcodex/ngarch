import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericCliExecComponent } from './generic-cli-exec.component';

describe('GenericCliExecComponent', () => {
  let component: GenericCliExecComponent;
  let fixture: ComponentFixture<GenericCliExecComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericCliExecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericCliExecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
