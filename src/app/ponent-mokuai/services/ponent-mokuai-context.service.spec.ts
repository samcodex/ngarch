import { TestBed, inject } from '@angular/core/testing';

import { PonentMokuaiContextService } from './ponent-mokuai-context.service';

describe('PonentMokuaiContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentMokuaiContextService]
    });
  });

  it('should be created', inject([PonentMokuaiContextService], (service: PonentMokuaiContextService) => {
    expect(service).toBeTruthy();
  }));
});
