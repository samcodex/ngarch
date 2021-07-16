import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArchHeaderComponent } from './arch-header.component';

describe('ArchHeaderComponent', () => {
  let component: ArchHeaderComponent;
  let fixture: ComponentFixture<ArchHeaderComponent>;

  beforeEach(waitForAsync(() => {
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
