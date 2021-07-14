import { LogLevel } from "./contracts/log-level";

export abstract class LogConfig {
  public appName?: string;

  public logLevel?: LogLevel;

  public blackList?: string[];
}
