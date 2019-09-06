import { MokuaiDetailModule } from './mokuai-detail.module';

describe('MokuaiDetailModule', () => {
  let mokuaiDetailModule: MokuaiDetailModule;

  beforeEach(() => {
    mokuaiDetailModule = new MokuaiDetailModule();
  });

  it('should create an instance', () => {
    expect(mokuaiDetailModule).toBeTruthy();
  });
});
