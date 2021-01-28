import { TestBed, inject } from '@angular/core/testing';

import { ReloadRegisterService } from './reload-register.service';

describe('ReloadRegisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReloadRegisterService]
    });
  });

  it('should be created', inject([ReloadRegisterService], (service: ReloadRegisterService) => {
    expect(service).toBeTruthy();
  }));
});
