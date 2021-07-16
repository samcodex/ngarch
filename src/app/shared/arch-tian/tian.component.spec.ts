import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TianComponent } from './tian.component';

describe('TianComponent', () => {
  let component: TianComponent;
  let fixture: ComponentFixture<TianComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
