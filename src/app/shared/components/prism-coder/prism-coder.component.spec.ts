import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrismCoderComponent } from './prism-coder.component';

describe('PrismCoderComponent', () => {
  let component: PrismCoderComponent;
  let fixture: ComponentFixture<PrismCoderComponent>;

  beforeEach(waitForAsync(() => {
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
