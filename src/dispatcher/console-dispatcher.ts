/* eslint-disable no-console */
import stringify from "json-stringify-safe";
import type { LogLevel } from "../contracts/log-level";
import { LogItem } from "../contracts/log-level";
import type { LogMessage } from "../contracts/log-message";
import type { LogDispatcher } from "../contracts/log-dispatcher";

export class ConsoleDispatcher implements LogDispatcher {
  private readonly level: LogItem;

  public constructor(logLevel?: LogLevel) {
    this.level = new LogItem(logLevel);
  }

  public handle(message: LogMessage): void {
    if (this.level.isLessThan(message["log-level"])) {
      console.log(stringify(message));
    }
  }
}
