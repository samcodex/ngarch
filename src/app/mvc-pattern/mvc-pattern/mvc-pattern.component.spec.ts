import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvcPatternComponent } from './mvc-pattern.component';

describe('MvcPatternComponent', () => {
  let component: MvcPatternComponent;
  let fixture: ComponentFixture<MvcPatternComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvcPatternComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvcPatternComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
