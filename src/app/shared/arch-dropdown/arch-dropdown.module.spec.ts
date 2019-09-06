import { ArchDropdownModule } from './arch-dropdown.module';

describe('ArchDropdownModule', () => {
  let archDropdownModule: ArchDropdownModule;

  beforeEach(() => {
    archDropdownModule = new ArchDropdownModule();
  });

  it('should create an instance', () => {
    expect(archDropdownModule).toBeTruthy();
  });
});
