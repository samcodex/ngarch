import { TestBed, inject } from '@angular/core/testing';

import { PonentLoaderService } from './ponent-loader.service';

describe('PonentLoader.Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PonentLoaderService]
    });
  });

  it('should be created', inject([PonentLoaderService], (service: PonentLoaderService) => {
    expect(service).toBeTruthy();
  }));
});
