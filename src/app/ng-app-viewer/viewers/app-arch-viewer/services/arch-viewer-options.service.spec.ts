import { TestBed } from '@angular/core/testing';

import { ArchViewerOptionsService } from './arch-viewer-options.service';

describe('ArchViewerOptionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchViewerOptionsService = TestBed.get(ArchViewerOptionsService);
    expect(service).toBeTruthy();
  });
});
