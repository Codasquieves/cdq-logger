import type { LogLevel } from "./contracts/log-level";

export abstract class LogConfig {
  public appName?: string;

  public logLevel?: LogLevel;

  public blackList?: string[];

  public batch: boolean;

  public constructor() {
    this.batch = false;
  }
}
