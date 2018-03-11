import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClazzDiagramComponent } from './clazz-diagram.component';

describe('ClazzDiagramComponent', () => {
  let component: ClazzDiagramComponent;
  let fixture: ComponentFixture<ClazzDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClazzDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClazzDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
