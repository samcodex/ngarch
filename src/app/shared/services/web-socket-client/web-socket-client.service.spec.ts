import { TestBed, inject } from '@angular/core/testing';

import { WebSocketClientService } from './web-socket-client.service';

describe('WebSocketClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketClientService]
    });
  });

  it('should be created', inject([WebSocketClientService], (service: WebSocketClientService) => {
    expect(service).toBeTruthy();
  }));
});
