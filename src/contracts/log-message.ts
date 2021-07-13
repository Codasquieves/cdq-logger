import { LogError } from "./log-error";
import { LogLevel } from "./log-level";

export interface LogMessage {
  "log-level": LogLevel;
  date: string;
  correlationId: string;
  message: string;
  name?: string;
  params?: object;
  error?: LogError;
}
