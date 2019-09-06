import { ArchCliModule } from './arch-cli.module';

describe('ArchCliModule', () => {
  let archCliModule: ArchCliModule;

  beforeEach(() => {
    archCliModule = new ArchCliModule();
  });

  it('should create an instance', () => {
    expect(archCliModule).toBeTruthy();
  });
});
