import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TianTitleComponent } from './tian-title.component';

describe('TianTitleComponent', () => {
  let component: TianTitleComponent;
  let fixture: ComponentFixture<TianTitleComponent>;

  beforeEach(async(() => {
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
