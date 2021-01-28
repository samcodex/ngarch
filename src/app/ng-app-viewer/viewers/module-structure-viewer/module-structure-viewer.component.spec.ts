import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleStructureViewerComponent } from './module-structure-viewer.component';

describe('ModuleStructureViewerComponent', () => {
  let component: ModuleStructureViewerComponent;
  let fixture: ComponentFixture<ModuleStructureViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleStructureViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleStructureViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
