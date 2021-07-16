import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MokuaiDetailComponent } from './mokuai-detail.component';

describe('MokuaiDetailComponent', () => {
  let component: MokuaiDetailComponent;
  let fixture: ComponentFixture<MokuaiDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MokuaiDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MokuaiDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
