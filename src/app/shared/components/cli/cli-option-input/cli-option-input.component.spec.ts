import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CliOptionInputComponent } from './cli-option-input.component';

describe('CliOptionInputComponent', () => {
  let component: CliOptionInputComponent;
  let fixture: ComponentFixture<CliOptionInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CliOptionInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliOptionInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
