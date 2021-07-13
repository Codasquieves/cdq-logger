export enum LogLevel {
  trace = "trace",
  debug = "debug",
  info = "info",
  warn = "warn",
  error = "error",
  fatal = "fatal",
  silent = "silent"
}

const score = {
  [LogLevel.trace]: 0,
  [LogLevel.debug]: 1,
  [LogLevel.info]: 2,
  [LogLevel.warn]: 3,
  [LogLevel.error]: 4,
  [LogLevel.fatal]: 5,
  [LogLevel.silent]: 100000
};

export class LogItem {
  public readonly name: LogLevel;

  public readonly score: number;

  public constructor(level: LogLevel) {
    this.name = level;
    this.score = score[level];
  }

  public isLessThan(level: LogLevel): boolean {
    const compareLevel = score[level];

    return this.score <= compareLevel;
  }
}
