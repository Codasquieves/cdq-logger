export enum LogLevel {
  metrics = "metrics",
  trace = "trace",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  fatal = "fatal",
  silent = "silent",
}

const score: Record<LogLevel, number> = {
  [LogLevel.trace]: 0,
  [LogLevel.debug]: 1,
  [LogLevel.info]: 2,
  [LogLevel.warn]: 3,
  [LogLevel.error]: 4,
  [LogLevel.fatal]: 5,
  [LogLevel.metrics]: 9999,
  [LogLevel.silent]: 100000,
};

export class LogItem {
  public readonly score: number;

  public constructor(level?: LogLevel) {
    this.score = score[level ?? LogLevel.error];
  }

  public isLessThan(level: LogLevel): boolean {
    const compareLevel = score[level];

    return this.score <= compareLevel;
  }
}
