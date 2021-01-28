import { TestBed, inject } from '@angular/core/testing';

import { PonentMokuaiDataService } from './ponent-mokuai-data.service';

describe('PonentMokuaiDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentMokuaiDataService]
    });
  });

  it('should be created', inject([PonentMokuaiDataService], (service: PonentMokuaiDataService) => {
    expect(service).toBeTruthy();
  }));
});
