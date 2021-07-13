import { LogLevel } from "./contracts/log-level";

export interface LogConfig {
  appName?: string;
  logLevel?: LogLevel;
  blackList?: string[];
}
