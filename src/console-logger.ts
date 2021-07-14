/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isNullOrUndefined } from "util";
import pino from "pino";
import { v4 } from "uuid";
import parseError from "parse-error";
import { inject, injectable } from "inversify";
import { LogConfig } from "./log-config";
import { LogLevel } from "./contracts/log-level";
import { Logger } from "./logger";
import { FilterLogger } from "./filter/filter-logger";

@injectable()
export class ConsoleLogger implements Logger {
  public readonly correlationId: string;

  private readonly pino: pino.Logger;

  private readonly filter: FilterLogger;

  public constructor(@inject(LogConfig) config: LogConfig) {
    this.correlationId = v4();

    this.filter = new FilterLogger(config.blackList);

    this.pino = pino({
      formatters: {
        level: (level: string): object => {
          return {
            "log-level": level
          };
        }
      },
      level: config.logLevel ?? LogLevel.error,
      messageKey: "message",
      name: config.appName,
      timestamp: (): string => `,"date": "${new Date().toISOString()}"`
    });
  }

  public debug(message: string, params?: object): void {
    const formattedParams = this.parseParams(params);

    this.pino.debug(formattedParams, message);
  }

  public error(message: string, error: Error, params?: object): void {
    const formattedParams = this.parseParams(params, error);

    this.pino.error(formattedParams, message);
  }

  public fatal(message: string, error?: Error, params?: object): void {
    const formattedParams = this.parseParams(params, error);

    this.pino.fatal(formattedParams, message);
  }

  public info(message: string, params?: object): void {
    const formattedParams = this.parseParams(params);

    this.pino.info(formattedParams, message);
  }

  public trace(message: string, params?: object): void {
    const formattedParams = this.parseParams(params);

    this.pino.trace(formattedParams, message);
  }

  public warn(message: string, params?: object): void {
    const formattedParams = this.parseParams(params);

    this.pino.warn(formattedParams, message);
  }

  private parseParams(params?: object, ex?: Error): any {
    return {
      correlationId: this.correlationId,
      error: isNullOrUndefined(ex) ? ex : parseError(ex),
      params: this.filter.clear(params)
    };
  }
}
