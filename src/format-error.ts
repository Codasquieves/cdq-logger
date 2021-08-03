/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { isNullOrUndefined } from "util";
import type { AxiosError } from "axios";
import parseError from "parse-error";
import type { LogError } from "./contracts/log-error";
import type { FilterLogger } from "./filter/filter-logger";

export class FormatError {
  private readonly filter: FilterLogger;

  public constructor(filter: FilterLogger) {
    this.filter = filter;
  }

  public format(error?: Error): LogError | undefined {
    if (isNullOrUndefined(error)) {
      return undefined;
    }

    const result: LogError = {
      info: parseError(error),
    };

    const axiosError: AxiosError = error as AxiosError;

    if (axiosError.isAxiosError) {
      result.request = {
        baseUrl: axiosError.config.baseURL,
        data: axiosError.config.params,
        headers: axiosError.config.headers,
        method: axiosError.config.method,
        params: axiosError.config.params,
        url: axiosError.config.url,
      };

      result.response = {
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        status: axiosError.response?.status,
      };
    }

    return this.filter.clear(result);
  }
}
