import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ArchComponent } from './arch.component';
describe('ArchComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        ArchComponent
      ],
    }).compileComponents();
  }));
  it('should create the arch', async(() => {
    const fixture = TestBed.createComponent(ArchComponent);
    const arch = fixture.debugElement.componentInstance;
    expect(arch).toBeTruthy();
  }));
  it(`should have as title 'ngArch'`, async(() => {
    const fixture = TestBed.createComponent(ArchComponent);
    const arch = fixture.debugElement.componentInstance;
    expect(arch.title).toEqual('ngArch');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(ArchComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngArch!');
  }));
});
