import { LOG_LEVEL } from "./LoggerConfig";

/** Signature of a logging function */
export interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

/** Log levels */
export type LogLevel = "log" | "warn" | "error";

const NO_OP: LogFn = (message?: any, ...optionalParams: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    // Bind the console methods and modify them to accept an optional source parameter
    this.error = (message?: any, source?: string, ...optionalParams: any[]) => {
      console.error(source ? `[${source}]` : "", message, ...optionalParams);
    };

    if (level === "error") {
      this.warn = NO_OP;
      this.log = NO_OP;
      return;
    }

    this.warn = (message?: any, source?: string, ...optionalParams: any[]) => {
      console.warn(source ? `[${source}]` : "", message, ...optionalParams);
    };

    if (level === "warn") {
      this.log = NO_OP;
      return;
    }

    this.log = (message?: any, source?: string, ...optionalParams: any[]) => {
      if (
        Array.isArray(message) &&
        message.every((item) => typeof item === "object" && item !== null)
      ) {
        console.table(message);
      } else {
        console.log(source ? `[${source}]` : "", message, ...optionalParams);
      }
    };
  }
}

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export { logger };
