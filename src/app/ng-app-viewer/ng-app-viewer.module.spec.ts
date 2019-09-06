import { NgAppViewerModule } from './ng-app-viewer.module';

describe('NgAppViewerModule', () => {
  let ngAppViewsModule: NgAppViewerModule;

  beforeEach(() => {
    ngAppViewsModule = new NgAppViewerModule();
  });

  it('should create an instance', () => {
    expect(ngAppViewsModule).toBeTruthy();
  });
});
