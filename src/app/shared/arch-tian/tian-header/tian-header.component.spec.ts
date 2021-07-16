import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TianHeaderComponent } from './tian-header.component';

describe('TianHeaderComponent', () => {
  let component: TianHeaderComponent;
  let fixture: ComponentFixture<TianHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TianHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TianHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
