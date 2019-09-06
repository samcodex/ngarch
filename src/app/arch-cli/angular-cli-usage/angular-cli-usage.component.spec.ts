import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularCliUsageComponent } from './angular-cli-usage.component';

describe('AngularCliUsageComponent', () => {
  let component: AngularCliUsageComponent;
  let fixture: ComponentFixture<AngularCliUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularCliUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularCliUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
