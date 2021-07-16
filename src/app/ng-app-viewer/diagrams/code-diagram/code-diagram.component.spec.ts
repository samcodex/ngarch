import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CodeDiagramComponent } from './code-diagram.component';

describe('CodeDiagramComponent', () => {
  let component: CodeDiagramComponent;
  let fixture: ComponentFixture<CodeDiagramComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CodeDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
