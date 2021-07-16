import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PonentCliComponent } from './ponent-cli.component';

describe('PonentCliComponent', () => {
  let component: PonentCliComponent;
  let fixture: ComponentFixture<PonentCliComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PonentCliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PonentCliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
