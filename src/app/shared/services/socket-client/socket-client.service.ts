import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';

import { ISocketClient } from '@core/models/socket-client.interface';
import { ArchConfigService } from '../arch-config/arch-config.service';

@Injectable()
export class SocketClientService implements ISocketClient {

  private socket;

  constructor(
    private archConfig: ArchConfigService
  ) {
    this.initSocket();
  }

  public initSocket(): void {
    this.socket = socketIo(this.archConfig.getDomainUrl());
  }

  public send(command: string, message: any): void {
    this.socket.emit(command, message);
  }

  public on(command: string, handler: (data) => void) {
    // TODO - multiple handlers
    this.socket.on(command, handler);
  }

  remove(command: string, options?: any) {
    // TODO - remove command-handler
  }
}
