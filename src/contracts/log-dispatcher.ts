import type { LogMessage } from "./log-message";

export interface LogDispatcher {
  handle: (message: LogMessage) => void;
}
