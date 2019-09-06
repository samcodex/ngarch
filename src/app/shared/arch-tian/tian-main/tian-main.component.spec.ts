import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TianMainComponent } from './tian-main.component';

describe('TianMainComponent', () => {
  let component: TianMainComponent;
  let fixture: ComponentFixture<TianMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TianMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TianMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
