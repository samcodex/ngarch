import { TestBed, inject } from '@angular/core/testing';

import { ArchConfigService } from './arch-config.service';

describe('ArchConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ArchConfigService]
    });
  });

  it('should be created', inject([ArchConfigService], (service: ArchConfigService) => {
    expect(service).toBeTruthy();
  }));
});
