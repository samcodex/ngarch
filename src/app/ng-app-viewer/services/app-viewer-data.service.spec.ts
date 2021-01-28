import { TestBed } from '@angular/core/testing';

import { AppViewerDataService } from './app-viewer-data.service';

describe('AppViewerDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppViewerDataService = TestBed.get(AppViewerDataService);
    expect(service).toBeTruthy();
  });
});
