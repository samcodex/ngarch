import { TestBed, inject } from '@angular/core/testing';

import { ProjectConfigService } from './project-config.service';

describe('ProjectConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectConfigService]
    });
  });

  it('should be created', inject([ProjectConfigService], (service: ProjectConfigService) => {
    expect(service).toBeTruthy();
  }));
});
