import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingGroupComponent } from './loading-group.component';

describe('LoadingGroupComponent', () => {
  let component: LoadingGroupComponent;
  let fixture: ComponentFixture<LoadingGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
