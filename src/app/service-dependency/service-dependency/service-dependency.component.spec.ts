import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceDependencyComponent } from './service-dependency.component';

describe('ServiceDependencyComponent', () => {
  let component: ServiceDependencyComponent;
  let fixture: ComponentFixture<ServiceDependencyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDependencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDependencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
