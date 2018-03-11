import { TestBed, inject } from '@angular/core/testing';

import { PonentDiagramDataService } from './ponent-diagram-data.service';

describe('PonentDiagramDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentDiagramDataService]
    });
  });

  it('should be created', inject([PonentDiagramDataService], (service: PonentDiagramDataService) => {
    expect(service).toBeTruthy();
  }));
});
