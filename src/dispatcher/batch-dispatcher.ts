import { LogMessage } from "../contracts/log-message";
import { LogItem, LogLevel } from "../contracts/log-level";
import { DirectDispatcher } from "./direct-dispatcher";
import { LogDispatcher } from "./log-dispatcher";

export class BatchDispatcher implements LogDispatcher {
  private readonly directDispatcher: LogDispatcher;

  private readonly logItem: LogItem;

  private messages: [LogLevel, LogMessage][];

  public constructor(minimunLevel?: LogLevel) {
    this.directDispatcher = new DirectDispatcher();

    this.logItem = new LogItem(minimunLevel ?? LogLevel.error);

    this.messages = [];
  }

  public handle(level: LogLevel, message: LogMessage): LogDispatcher {
    this.messages.push([level, message]);

    if (this.logItem.isLessThan(level)) {
      this.printAll();
      return this.directDispatcher;
    }

    return this;
  }

  private printAll(): void {
    for (const item of this.messages) {
      const [level, message] = item;
      this.directDispatcher.handle(level, message);
    }
    this.messages = [];
  }
}
