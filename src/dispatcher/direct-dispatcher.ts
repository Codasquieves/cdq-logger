import stringify from "json-stringify-safe";
import { LogMessage } from "../contracts/log-message";
import { LogLevel } from "../contracts/log-level";
import { LogDispatcher } from "./log-dispatcher";

export class DirectDispatcher implements LogDispatcher {
  public handle(_level: LogLevel, message: LogMessage): LogDispatcher {
    console.log(stringify(message));

    return this;
  }
}
