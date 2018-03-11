export interface ISocketClient {
  initSocket(): void;
  send(command: string, message: any): void;
  on(command: string, handler: (data) => void, options?: any): void;
  remove(command: string, options?: any): void;
}
