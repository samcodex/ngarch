import { TestBed, inject } from '@angular/core/testing';

import { ProjectProfileService } from './project-profile.service';

describe('ProjectProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectProfileService]
    });
  });

  it('should be created', inject([ProjectProfileService], (service: ProjectProfileService) => {
    expect(service).toBeTruthy();
  }));
});
