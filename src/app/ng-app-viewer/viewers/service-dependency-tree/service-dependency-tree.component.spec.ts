import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDependencyTreeComponent } from './service-dependency-tree.component';

describe('ServiceDependencyTreeComponent', () => {
  let component: ServiceDependencyTreeComponent;
  let fixture: ComponentFixture<ServiceDependencyTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceDependencyTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDependencyTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
