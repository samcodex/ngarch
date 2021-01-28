import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplorerDockComponent } from './explorer-dock.component';

describe('ExplorerDockComponent', () => {
  let component: ExplorerDockComponent;
  let fixture: ComponentFixture<ExplorerDockComponent>;

  beforeEach(async(() => {
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
