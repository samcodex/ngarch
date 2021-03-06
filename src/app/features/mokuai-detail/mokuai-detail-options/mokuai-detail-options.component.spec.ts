import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MokuaiDetailOptionsComponent } from './mokuai-detail-options.component';

describe('MokuaiDetailOptionsComponent', () => {
  let component: MokuaiDetailOptionsComponent;
  let fixture: ComponentFixture<MokuaiDetailOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MokuaiDetailOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MokuaiDetailOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
