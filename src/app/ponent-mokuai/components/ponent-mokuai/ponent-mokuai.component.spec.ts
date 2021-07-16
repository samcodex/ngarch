import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PonentMokuaiComponent } from './ponent-mokuai.component';

describe('PonentMokuaiComponent', () => {
  let component: PonentMokuaiComponent;
  let fixture: ComponentFixture<PonentMokuaiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PonentMokuaiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonentMokuaiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
