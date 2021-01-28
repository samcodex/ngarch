import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchHeaderComponent } from './arch-header.component';

describe('ArchHeaderComponent', () => {
  let component: ArchHeaderComponent;
  let fixture: ComponentFixture<ArchHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
