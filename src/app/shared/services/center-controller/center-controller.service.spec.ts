import { TestBed, inject } from '@angular/core/testing';

import { CenterControllerService } from './center-controller.service';

describe('CenterControllerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CenterControllerService]
    });
  });

  it('should be created', inject([CenterControllerService], (service: CenterControllerService) => {
    expect(service).toBeTruthy();
  }));
});
