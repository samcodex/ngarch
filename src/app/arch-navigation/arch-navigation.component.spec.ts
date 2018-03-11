import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchNavigationComponent } from './arch-navigation.component';

describe('ArchNavigationComponent', () => {
  let component: ArchNavigationComponent;
  let fixture: ComponentFixture<ArchNavigationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchNavigationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
