import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchDropdownComponent } from './arch-dropdown.component';

describe('ArchDropdownComponent', () => {
  let component: ArchDropdownComponent;
  let fixture: ComponentFixture<ArchDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
