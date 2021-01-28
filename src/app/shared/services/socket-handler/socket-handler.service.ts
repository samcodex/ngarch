import { Observable , Subject } from 'rxjs';
import { Injectable, Inject } from '@angular/core';

import { ISocketClient } from '@core/models/socket-client.interface';
// import { SocketClientService } from '../socket-client/socket-client.service';
import { WebSocketClientService } from '../web-socket-client/web-socket-client.service';

@Injectable()
export class SocketHandlerService {
  private socketClient: ISocketClient;
  private responseSubject: Subject<any>;

  constructor(
    // @Inject(SocketClientService) socketClient: ISocketClient
    @Inject(WebSocketClientService) socketClient: ISocketClient
  ) {
    this.socketClient = socketClient;
  }

  send(command: string, message: any) {
    this.socketClient.send(command, message);
  }

  listen(command: string, options?: any): Observable<any> {
    return Observable.create((observer) => {
      this.socketClient.on(command, (data) => {
        observer.next(data);
      }, options);
    });
  }

  remove(command: string, options?: any) {
    this.socketClient.remove(command, options);
  }
}
