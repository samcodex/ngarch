import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PonentDiagramPanelToolBarComponent } from './ponent-diagram-panel-tool-bar.component';

describe('PonentDiagramPanelToolBarComponent', () => {
  let component: PonentDiagramPanelToolBarComponent;
  let fixture: ComponentFixture<PonentDiagramPanelToolBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PonentDiagramPanelToolBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonentDiagramPanelToolBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
