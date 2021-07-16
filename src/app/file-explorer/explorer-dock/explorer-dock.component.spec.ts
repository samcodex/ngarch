import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExplorerDockComponent } from './explorer-dock.component';

describe('ExplorerDockComponent', () => {
  let component: ExplorerDockComponent;
  let fixture: ComponentFixture<ExplorerDockComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExplorerDockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExplorerDockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
