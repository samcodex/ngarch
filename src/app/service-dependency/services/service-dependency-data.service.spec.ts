import { TestBed, inject } from '@angular/core/testing';

import { ServiceDependencyDataService } from './service-dependency-data.service';

describe('ServiceDependencyDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceDependencyDataService]
    });
  });

  it('should be created', inject([ServiceDependencyDataService], (service: ServiceDependencyDataService) => {
    expect(service).toBeTruthy();
  }));
});
