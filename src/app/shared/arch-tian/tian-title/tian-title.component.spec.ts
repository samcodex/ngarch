import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TianTitleComponent } from './tian-title.component';

describe('TianTitleComponent', () => {
  let component: TianTitleComponent;
  let fixture: ComponentFixture<TianTitleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TianTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TianTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
