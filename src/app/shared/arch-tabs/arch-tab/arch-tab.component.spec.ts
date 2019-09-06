import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchTabComponent } from './arch-tab.component';

describe('ArchTabComponent', () => {
  let component: ArchTabComponent;
  let fixture: ComponentFixture<ArchTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
