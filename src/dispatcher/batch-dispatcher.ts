import { LogItem, LogLevel } from "../contracts/log-level";
import type { LogMessage } from "../contracts/log-message";
import type { LogDispatcher } from "../contracts/log-dispatcher";
import { ConsoleDispatcher } from "./console-dispatcher";

export class BatchDispatcher implements LogDispatcher {
  private readonly level: LogItem;

  private readonly console: ConsoleDispatcher;

  private direct: boolean;

  private messages: LogMessage[];

  public constructor(minimun?: LogLevel) {
    this.level = new LogItem(minimun);
    this.console = new ConsoleDispatcher(LogLevel.debug);
    this.direct = false;
    this.messages = [];
  }

  public handle(message: LogMessage): void {
    if (this.direct) {
      this.console.handle(message);
      return;
    }

    this.messages.push(message);

    if (this.level.isLessThan(message["log-level"])) {
      this.direct = true;
      this.printAll();
      this.messages = [];
    }
  }

  private printAll(): void {
    for (const message of this.messages) {
      this.console.handle(message);
    }
  }
}
