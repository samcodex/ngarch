import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArchHelpComponent } from './arch-help.component';

describe('ArchHelpComponent', () => {
  let component: ArchHelpComponent;
  let fixture: ComponentFixture<ArchHelpComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
