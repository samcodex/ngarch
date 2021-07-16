import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ArchTabsComponent } from './arch-tabs.component';

describe('ArchTabsComponent', () => {
  let component: ArchTabsComponent;
  let fixture: ComponentFixture<ArchTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
