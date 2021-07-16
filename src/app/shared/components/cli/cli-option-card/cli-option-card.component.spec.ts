import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CliOptionCardComponent } from './cli-option-card.component';

describe('CliOptionCardComponent', () => {
  let component: CliOptionCardComponent;
  let fixture: ComponentFixture<CliOptionCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CliOptionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CliOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
