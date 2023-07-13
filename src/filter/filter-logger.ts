/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { isNullOrUndefined } from "util";
import stringify from "json-stringify-safe";
import { defaultBlackList } from "./black-list";

const MASK = "**sensitive**";

export class FilterLogger {
  private readonly blackList: string[];

  public constructor(blackList?: string[]) {
    const values = blackList ?? [];

    this.blackList = [...values, ...defaultBlackList];
  }

  public clear<T = object>(params?: T): T | undefined {
    if (isNullOrUndefined(params)) {
      return params;
    }

    return this.filterObject(this.clone(params));
  }

  private clone<T = object>(item: T): T {
    return JSON.parse(stringify(item));
  }

  private filterObject<T = object>(item: T): T {
    if (isNullOrUndefined(item)) {
      return item;
    }

    Object.keys(item as object).forEach((key: string): void => {
      item[key] = this.filterItem(key, item[key]);
    });

    return item;
  }

  private filterItem(key: string, item: unknown): unknown {
    if (this.isOnBlacklist(key)) {
      return MASK;
    }

    if (this.isArray(item)) {
      return item.map(this.filterItem.bind(this, key));
    }

    if (this.isObject(item)) {
      return this.filterObject(item);
    }

    if (this.isJSONString(item)) {
      return stringify(this.filterItem(key, JSON.parse(item)));
    }

    return item;
  }

  private isJSONString(value: unknown): value is string {
    if (typeof value !== "string") {
      return false;
    }

    if (!value.startsWith("{") && !value.startsWith("[")) {
      return false;
    }

    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  }

  private isOnBlacklist(key: string): boolean {
    return this.blackList.includes(key);
  }

  private isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  private isObject(value: unknown): value is object {
    return typeof value === "object";
  }
}
