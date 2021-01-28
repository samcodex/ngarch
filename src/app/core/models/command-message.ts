export class CommandMessage {
  command: string;
  message: any;

  constructor(cmd: string, msg: any) {
    this.command = cmd;
    this.message = msg;
  }

  public static parse(data: string): CommandMessage {
    const obj = JSON.parse(data);
    const command = obj.$command;
    const message = obj.$message;

    return new CommandMessage(command, message);
  }

  public json(): string {
    const obj = {$command: this.command, $message: this.message};
    return JSON.stringify(obj);
  }

}
