import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PonentMokuaiComponent } from './ponent-mokuai.component';

describe('PonentMokuaiComponent', () => {
  let component: PonentMokuaiComponent;
  let fixture: ComponentFixture<PonentMokuaiComponent>;

  beforeEach(async(() => {
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
