import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PonentMokuaiRoutesComponent } from './ponent-mokuai-routes.component';

describe('PonentMokuaiRoutesComponent', () => {
  let component: PonentMokuaiRoutesComponent;
  let fixture: ComponentFixture<PonentMokuaiRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PonentMokuaiRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonentMokuaiRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
