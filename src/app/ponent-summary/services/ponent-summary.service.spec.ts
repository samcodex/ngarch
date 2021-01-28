import { TestBed, inject } from '@angular/core/testing';

import { PonentSummaryService } from './ponent-summary.service';

describe('PonentSummaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentSummaryService]
    });
  });

  it('should be created', inject([PonentSummaryService], (service: PonentSummaryService) => {
    expect(service).toBeTruthy();
  }));
});
