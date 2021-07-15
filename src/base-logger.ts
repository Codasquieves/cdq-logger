/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import callsites from "callsites";
import { v4 } from "uuid";
import { inject, injectable } from "inversify";
import { LogLevel } from "./contracts/log-level";
import type { LogMessage } from "./contracts/log-message";
import { FilterLogger } from "./filter/filter-logger";
import { LogConfig } from "./log-config";
import type { Logger } from "./logger";
import type { LogDispatcher } from "./contracts/log-dispatcher";
import { ConsoleDispatcher } from "./dispatcher/console-dispatcher";
import { BatchDispatcher } from "./dispatcher/batch-dispatcher";
import { FormatError } from "./format-error";

const EXECUTOR = 2;

@injectable()
export class BaseLogger implements Logger {
  public readonly correlationId: string;

  private readonly filter: FilterLogger;

  private readonly formatError: FormatError;

  private readonly config: LogConfig;

  private readonly dispatcher: LogDispatcher;

  public constructor(@inject(LogConfig) config: LogConfig) {
    this.correlationId = v4();
    this.config = config;

    this.filter = new FilterLogger(config.blackList);
    this.formatError = new FormatError(this.filter);

    const minimunLog = config.logLevel;
    this.dispatcher = (config.batchLog ?? false) ? new BatchDispatcher(minimunLog) : new ConsoleDispatcher(minimunLog);
  }

  public trace(message: string, params?: object): void {
    const formattedParams = this.formatMessage(LogLevel.trace, message, params);
    this.dispatcher.handle(formattedParams);
  }

  public debug(message: string, params?: object): void {
    const formattedParams = this.formatMessage(LogLevel.debug, message, params);
    this.dispatcher.handle(formattedParams);
  }

  public info(message: string, params?: object): void {
    const formattedParams = this.formatMessage(LogLevel.info, message, params);
    this.dispatcher.handle(formattedParams);
  }

  public warn(message: string, params?: object): void {
    const formattedParams = this.formatMessage(LogLevel.warn, message, params);
    this.dispatcher.handle(formattedParams);
  }

  public error(message: string, error: Error, params?: object): void {
    const formattedParams = this.formatMessage(LogLevel.error, message, params, error);
    this.dispatcher.handle(formattedParams);
  }

  public fatal(message: string, error?: Error, params?: object): void {
    const formattedParams = this.formatMessage(LogLevel.fatal, message, params, error);
    this.dispatcher.handle(formattedParams);
  }

  private formatMessage(level: LogLevel, message: string, params?: object, ex?: Error): LogMessage {
    const executor = callsites[EXECUTOR];

    return {
      application: this.config.appName,
      correlationId: this.correlationId,
      date: new Date().toISOString(),
      error: this.formatError.format(ex),
      execution: `${executor.getTypeName()}.${executor.getMethodName()}`,
      "log-level": level,
      message,
      params: this.filter.clear(params)
    };
  }
}
