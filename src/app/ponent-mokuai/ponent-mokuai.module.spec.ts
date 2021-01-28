import { PonentMokuaiModule } from './ponent-mokuai.module';

describe('PonentMokuaiModule', () => {
  let ponentMokuaiModule: PonentMokuaiModule;

  beforeEach(() => {
    ponentMokuaiModule = new PonentMokuaiModule();
  });

  it('should create an instance', () => {
    expect(ponentMokuaiModule).toBeTruthy();
  });
});
