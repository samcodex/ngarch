import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchNavigationSectionComponent } from './arch-navigation-section.component';

describe('ArchNavigationSectionComponent', () => {
  let component: ArchNavigationSectionComponent;
  let fixture: ComponentFixture<ArchNavigationSectionComponent>;

  beforeEach(async(() => {
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
