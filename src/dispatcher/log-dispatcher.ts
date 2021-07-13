import { LogMessage } from "../contracts/log-message";
import { LogLevel } from "../contracts/log-level";

export interface LogDispatcher {
  handle: (level: LogLevel, message: LogMessage) => LogDispatcher;
}
