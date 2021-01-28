import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerCanvasComponent } from './explorer-canvas.component';

describe('ExplorerCanvasComponent', () => {
  let component: ExplorerCanvasComponent;
  let fixture: ComponentFixture<ExplorerCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
