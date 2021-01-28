import { ArchApisViewerModule } from './arch-apis-viewer.module';

describe('ArchApisViewerModule', () => {
  let archApiViewModule: ArchApisViewerModule;

  beforeEach(() => {
    archApiViewModule = new ArchApisViewerModule();
  });

  it('should create an instance', () => {
    expect(archApiViewModule).toBeTruthy();
  });
});
