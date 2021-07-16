import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GenericOptionComponent } from './generic-option.component';

describe('GenericOptionComponent', () => {
  let component: GenericOptionComponent;
  let fixture: ComponentFixture<GenericOptionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
