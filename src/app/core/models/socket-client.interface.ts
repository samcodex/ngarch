export interface ISocketClient {
  initSocket(): void;
  send(command: string | SocketTasks, message: any): void;
  on(command: string | SocketTasks, handler: (data) => void, options?: any): void;
  remove(command: string | SocketTasks, options?: any): void;
}

export enum SocketTasks {
  OnError = 'OnError',
  OnOpen = 'OnOpen'
}
