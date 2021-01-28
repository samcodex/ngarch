import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MokuaiDetailComponent } from './mokuai-detail.component';

describe('MokuaiDetailComponent', () => {
  let component: MokuaiDetailComponent;
  let fixture: ComponentFixture<MokuaiDetailComponent>;

  beforeEach(async(() => {
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
