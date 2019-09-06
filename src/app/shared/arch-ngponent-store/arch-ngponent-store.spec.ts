import { TestBed, inject } from '@angular/core/testing';

import { ArchNgPonentStore } from './arch-ngponent-store';

describe('ArchNgPonentStore.Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArchNgPonentStore]
    });
  });

  it('should be created', inject([ArchNgPonentStore], (service: ArchNgPonentStore) => {
    expect(service).toBeTruthy();
  }));
});
