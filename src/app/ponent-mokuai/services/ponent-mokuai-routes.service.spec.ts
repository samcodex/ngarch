import { TestBed, inject } from '@angular/core/testing';

import { PonentMokuaiRoutesService } from './ponent-mokuai-routes.service';

describe('PonentMokuaiRoutesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentMokuaiRoutesService]
    });
  });

  it('should be created', inject([PonentMokuaiRoutesService], (service: PonentMokuaiRoutesService) => {
    expect(service).toBeTruthy();
  }));
});
