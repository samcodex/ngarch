import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PonentDiagramComponent } from './ponent-diagram.component';

describe('PonentDiagramComponent', () => {
  let component: PonentDiagramComponent;
  let fixture: ComponentFixture<PonentDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PonentDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonentDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
