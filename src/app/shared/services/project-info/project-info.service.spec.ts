import { TestBed, inject } from '@angular/core/testing';

import { ProjectInfoService } from './project-info.service';

describe('ProjectInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectInfoService]
    });
  });

  it('should be created', inject([ProjectInfoService], (service: ProjectInfoService) => {
    expect(service).toBeTruthy();
  }));
});
