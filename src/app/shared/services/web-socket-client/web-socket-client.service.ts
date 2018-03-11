import { Injectable } from '@angular/core';

import { ISocketClient } from './../../../core/models/socket-client.interface';
import { ArchConfigService, Protocol } from '../arch-config/arch-config.service';
import { CommandMessage } from '../../../core/models/command-message';
import { NameValue } from '../../../core/models/name-value';


@Injectable()
export class WebSocketClientService implements ISocketClient {

  private socket: WebSocket;
  private socketTasks: NameValue[] = [];
  private url: string;
  private count: number;

  constructor(
    private archConfig: ArchConfigService
  ) {
    this.url = this.archConfig.getDomainUrl(Protocol.WebSocket);

    this.initSocket();
  }

  initSocket(): void {
    this.count = 0;
    this.connectServer();
  }

  private connectServer() {
    if (this.count > 20) {
      return;
    }

    ++this.count;
    this.socket = new WebSocket(this.url);

    this.socket.onclose = () => {
      setTimeout(this.connectServer.bind(this), 2000);
    };
    this.socket.onerror = () => {
      console.log('websocket - error');
    };
    this.socket.onopen = () => {
      this.socket.onmessage = (event) => {
        this.invokeTask(event.data);
      };
      // this.socket.addEventListener('message', (event) => {
      //   this.invokeTask(event.data);
      // });
    };
  }

  send(command: string, message: any): void {
    if (this.socket.OPEN) {
      const cmdMsg = new CommandMessage(command, message);
      this.socket.send(cmdMsg.json());
    }
  }

  on(command: string, handler: (data: any) => void, options?: any): void {
    this.socketTasks.push(new NameValue(command, handler, options));
  }

  remove(command: string, options?: any) {

    const index = this.socketTasks.findIndex( task => task.name === command
      && equalsId(options, task.options) );

    if (index > -1) {
      this.socketTasks.splice(index, 1);
    }
  }

  private invokeTask(message: string) {
    const cmdMsg = CommandMessage.parse(message);
    const cmd = cmdMsg.command;
    const msg = cmdMsg.message;
    const tasks = this.socketTasks.filter( tsk => tsk.name === cmd);

    if (tasks) {
      tasks.forEach( task => {
        task.value.call(null, msg);
      });
    }
  }
}

function equalsId(opt1: any, opt2: any): boolean {
  if (opt1 === opt2) {
    return true;
  } else {
    const type1 = typeof opt1;
    const type2 = typeof opt2;

    if (type1 === type2) {
      // if (type1 === 'string') {
      //   return opt1 === opt2;
      // } else
       if (type1 === 'object') {
        return opt1.id === opt2.id;
      }
    }
  }

  return false;
}
