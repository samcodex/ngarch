import { TestBed, inject } from '@angular/core/testing';

import { ProjectFilesService } from './project-files.service';

describe('ProjectFilesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectFilesService]
    });
  });

  it('should be created', inject([ProjectFilesService], (service: ProjectFilesService) => {
    expect(service).toBeTruthy();
  }));
});
