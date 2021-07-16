import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArchNavigationSectionComponent } from './arch-navigation-section.component';

describe('ArchNavigationSectionComponent', () => {
  let component: ArchNavigationSectionComponent;
  let fixture: ComponentFixture<ArchNavigationSectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchNavigationSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchNavigationSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
