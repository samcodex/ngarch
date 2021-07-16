import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadingStrategyComponent } from './loading-strategy.component';

describe('LoadingStrategyComponent', () => {
  let component: LoadingStrategyComponent;
  let fixture: ComponentFixture<LoadingStrategyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
