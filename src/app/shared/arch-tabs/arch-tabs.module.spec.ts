import { ArchTabsModule } from './arch-tabs.module';

describe('ArchTabsModule', () => {
  let archTabsModule: ArchTabsModule;

  beforeEach(() => {
    archTabsModule = new ArchTabsModule();
  });

  it('should create an instance', () => {
    expect(archTabsModule).toBeTruthy();
  });
});
