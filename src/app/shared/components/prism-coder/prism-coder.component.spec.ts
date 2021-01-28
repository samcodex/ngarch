import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrismCoderComponent } from './prism-coder.component';

describe('PrismCoderComponent', () => {
  let component: PrismCoderComponent;
  let fixture: ComponentFixture<PrismCoderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrismCoderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrismCoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
