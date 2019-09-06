import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericOptionComponent } from './generic-option.component';

describe('GenericOptionComponent', () => {
  let component: GenericOptionComponent;
  let fixture: ComponentFixture<GenericOptionComponent>;

  beforeEach(async(() => {
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
