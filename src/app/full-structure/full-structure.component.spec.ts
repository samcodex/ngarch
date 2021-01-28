import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullStructureComponent } from './full-structure.component';

describe('FullStructureComponent', () => {
  let component: FullStructureComponent;
  let fixture: ComponentFixture<FullStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
