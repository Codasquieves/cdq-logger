export abstract class Logger {
  public abstract correlationId: string;

  public abstract trace: (message: string, params?: object) => void;

  public abstract debug: (message: string, params?: object) => void;

  public abstract info: (message: string, params?: object) => void;

  public abstract warn: (message: string, params?: object) => void;

  public abstract metrics: (name: string, params?: object) => void;

  public abstract error: (message: string, error?: Error, params?: object) => void;

  public abstract fatal: (message: string, error?: Error, params?: object) => void;
}
