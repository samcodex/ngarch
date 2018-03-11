import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleNgponentSelectorComponent } from './module-ngponent-selector.component';

describe('ModuleNgponentSelectorComponent', () => {
  let component: ModuleNgponentSelectorComponent;
  let fixture: ComponentFixture<ModuleNgponentSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModuleNgponentSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleNgponentSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
