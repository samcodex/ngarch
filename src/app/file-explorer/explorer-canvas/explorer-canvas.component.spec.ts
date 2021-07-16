import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExplorerCanvasComponent } from './explorer-canvas.component';

describe('ExplorerCanvasComponent', () => {
  let component: ExplorerCanvasComponent;
  let fixture: ComponentFixture<ExplorerCanvasComponent>;

  beforeEach(waitForAsync(() => {
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
