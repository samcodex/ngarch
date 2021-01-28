import { TestBed, inject } from '@angular/core/testing';

import { PonentMokuaiOptionsService } from './ponent-mokuai-options.service';

describe('PonentMokuaiOptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentMokuaiOptionsService]
    });
  });

  it('should be created', inject([PonentMokuaiOptionsService], (service: PonentMokuaiOptionsService) => {
    expect(service).toBeTruthy();
  }));
});
