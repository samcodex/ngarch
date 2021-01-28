import { RouterPathViewerModule } from './router-path-viewer.module';

describe('RouterPathViewerModule', () => {
  let archRouterPathModule: RouterPathViewerModule;

  beforeEach(() => {
    archRouterPathModule = new RouterPathViewerModule();
  });

  it('should create an instance', () => {
    expect(archRouterPathModule).toBeTruthy();
  });
});
