/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { v4 } from "uuid";
import { FilterLogger } from "./filter/filter-logger";
import { LogConfig } from "./log-config";
import { LogLevel } from "./contracts/log-level";
import { Logger } from "./logger";
import { FormatError } from "./format-error";
import { LogDispatcher } from "./dispatcher/log-dispatcher";
import { BatchDispatcher } from "./dispatcher/batch-dispatcher";
import { LogMessage } from "./contracts/log-message";

export class BatchLogger implements Logger {
  public readonly correlationId: string;

  private readonly filter: FilterLogger;

  private readonly formatError: FormatError;

  private readonly logDispatcher: LogDispatcher;

  private readonly appName?: string;

  public constructor(config: LogConfig = {}) {
    this.correlationId = v4();

    this.filter = new FilterLogger(config.blackList);
    this.formatError = new FormatError(this.filter);
    this.logDispatcher = new BatchDispatcher(config.logLevel);

    this.appName = config.appName;
  }

  public trace(message: string, params?: object): void {
    this.dispatchLog(LogLevel.trace, message, params);
  }

  public debug(message: string, params?: object): void {
    this.dispatchLog(LogLevel.debug, message, params);
  }

  public info(message: string, params?: object): void {
    this.dispatchLog(LogLevel.info, message, params);
  }

  public warn(message: string, params?: object): void {
    this.dispatchLog(LogLevel.warn, message, params);
  }

  public error(message: string, error?: Error, params?: object): void {
    this.dispatchLog(LogLevel.error, message, params, error);
  }

  public fatal(message: string, error?: Error, params?: object): void {
    this.dispatchLog(LogLevel.fatal, message, params, error);
  }

  private dispatchLog(logLevel: LogLevel, message: string, params?: object, ex?: Error): void {
    const logMessage: LogMessage = {
      correlationId: this.correlationId,
      date: new Date().toISOString(),
      error: this.formatError.format(ex),
      "log-level": logLevel,
      message,
      name: this.appName,
      params: this.filter.clear(params)
    };

    this.logDispatcher.handle(logLevel, logMessage);
  }
}
