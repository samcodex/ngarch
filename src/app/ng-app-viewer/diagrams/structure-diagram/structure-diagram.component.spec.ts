import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StructureDiagramComponent } from './structure-diagram.component';

describe('StructureDiagramComponent', () => {
  let component: StructureDiagramComponent;
  let fixture: ComponentFixture<StructureDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
