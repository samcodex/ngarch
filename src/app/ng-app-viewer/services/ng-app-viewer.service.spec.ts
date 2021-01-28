import { TestBed } from '@angular/core/testing';

import { NgAppViewerService } from './ng-app-viewer.service';

describe('NgAppViewerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgAppViewerService = TestBed.get(NgAppViewerService);
    expect(service).toBeTruthy();
  });
});
