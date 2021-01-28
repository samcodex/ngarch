import { ArchTianModule } from './arch-tian.module';

describe('ArchTianModule', () => {
  let archTianModule: ArchTianModule;

  beforeEach(() => {
    archTianModule = new ArchTianModule();
  });

  it('should create an instance', () => {
    expect(archTianModule).toBeTruthy();
  });
});
