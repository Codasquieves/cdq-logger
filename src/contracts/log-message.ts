import type { LogError } from "./log-error";
import type { LogLevel } from "./log-level";

export interface LogMessage {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  "log-level": LogLevel;
  date: string;
  correlationId: string;
  message: string;
  application?: string;
  params?: object;
  error?: LogError;
  execution?: string;
}
