import { isString, isPlainObject } from "@utils/validator";
import { LogLevel } from ".";
import { isLogLevelEnabled } from "./is-log-level-enabled.util";

const yellow = (text: string) => text;

export interface ConsoleLoggerOptions {
  /**
   * Enabled log levels.
   */
  logLevels?: LogLevel[];
  /**
   * If enabled, will print timestamp (time difference) between current and previous log message.
   */
  timestamp?: boolean;
}

const DEFAULT_LOG_LEVELS: LogLevel[] = ["log", "error", "warn", "debug"];

export class ConsoleLogger {
  private static lastTimestampAt?: number;
  private originalContext?: string;

  constructor();
  constructor(context: string);
  constructor(context: string, options: ConsoleLoggerOptions);
  constructor(protected context?: string, protected options: ConsoleLoggerOptions = {}) {
    if (!options.logLevels) {
      options.logLevels = DEFAULT_LOG_LEVELS;
    }
    if (context) {
      this.originalContext = context;
    }
  }

  /**
   * Write a 'log' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: [...any, string?]): void;
  log(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled("log")) {
      return;
    }
    const { messages, context } = this.getContextAndMessagesToPrint([message, ...optionalParams]);
    this.printMessages(messages, context, "log");
  }

  /**
   * Write an 'error' level log, if the configured level allows for it.
   * Prints to `stderr` with newline.
   */
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: [...any, string?, string?]): void;
  error(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled("error")) {
      return;
    }
    const { messages, context, stack } = this.getContextAndStackAndMessagesToPrint([
      message,
      ...optionalParams,
    ]);

    this.printMessages(messages, context, "error");
    this.printStackTrace(stack!);
  }

  /**
   * Write a 'warn' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: [...any, string?]): void;
  warn(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled("warn")) {
      return;
    }
    const { messages, context } = this.getContextAndMessagesToPrint([message, ...optionalParams]);
    this.printMessages(messages, context, "warn");
  }

  /**
   * Write a 'debug' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: [...any, string?]): void;
  debug(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled("debug")) {
      return;
    }
    const { messages, context } = this.getContextAndMessagesToPrint([message, ...optionalParams]);
    this.printMessages(messages, context, "debug");
  }

  /**
   * Write a 'verbose' level log, if the configured level allows for it.
   * Prints to `stdout` with newline.
   */
  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: [...any, string?]): void;
  verbose(message: any, ...optionalParams: any[]) {
    if (!this.isLevelEnabled("log")) {
      return;
    }
    const { messages, context } = this.getContextAndMessagesToPrint([message, ...optionalParams]);
    this.printMessages(messages, context, "log");
  }

  /**
   * Set log levels
   * @param levels log levels
   */
  setLogLevels(levels: LogLevel[]) {
    if (!this.options) {
      this.options = {};
    }
    this.options.logLevels = levels;
  }

  /**
   * Set logger context
   * @param context context
   */
  setContext(context: string) {
    this.context = context;
  }

  /**
   * Resets the logger context to the value that was passed in the constructor.
   */
  resetContext() {
    this.context = this.originalContext;
  }

  isLevelEnabled(level: LogLevel): boolean {
    const logLevels = this.options?.logLevels;
    return isLogLevelEnabled(level, logLevels);
  }

  protected getTimestamp(): string {
    const localeStringOptions = {
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "2-digit",
      month: "2-digit",
    };
    return new Date(Date.now()).toLocaleString(
      undefined,
      localeStringOptions as Intl.DateTimeFormatOptions
    );
  }

  protected printMessages(
    messages: unknown[],
    context = "",
    logLevel: LogLevel = "log",
    writeStreamType?: "stdout" | "stderr"
  ) {
    messages.forEach((message) => {
      const contextMessage = this.formatContext(context);
      const timestampDiff = this.updateAndGetTimestampDiff();
      const formattedLogLevel = logLevel.toUpperCase().padStart(7, " ");

      if (typeof window === "undefined") {
        const formattedMessage = this.formatMessage(
          logLevel,
          message,
          formattedLogLevel,
          contextMessage,
          timestampDiff
        );
        process[writeStreamType ?? "stdout"].write(formattedMessage);
      } else {
        const formattedMessage = this.formatMessage2(
          logLevel,
          message,
          formattedLogLevel,
          contextMessage,
          timestampDiff
        );
        console[logLevel](...formattedMessage);
      }
    });
  }

  protected formatPid(pid: number) {
    return `[Nest] ${pid}  - `;
  }

  protected formatContext(context: string): string {
    return context ? yellow(`[${context}] `) : "";
  }

  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string
  ) {
    const output = this.stringifyMessage(message, logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
    return `${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
  }

  protected formatMessage2(
    logLevel: LogLevel,
    message: unknown,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string
  ) {
    const output = this.stringifyMessage(message, logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel, logLevel);
    return [
      `${this.getTimestamp()} %c${formattedLogLevel} %c${contextMessage} %c${output}%c${timestampDiff}\n`,
      this.getStyleByLogLevel(logLevel),
      "",
      this.getStyleByLogLevel(logLevel),
      "",
    ];
  }

  getStyleByLogLevel(level: LogLevel) {
    switch (level) {
      case "debug":
        return `color:#9b59b6`;
      case "warn":
        return `color:warning`;
      case "error":
        return `color:red`;
      default:
        return `color:green`;
    }
  }

  protected stringifyMessage(message: unknown, logLevel: LogLevel) {
    return isPlainObject(message) || Array.isArray(message)
      ? `${this.colorize("Object:", logLevel)}\n${JSON.stringify(
          message,
          (key, value) => (typeof value === "bigint" ? value.toString() : value),
          2
        )}\n`
      : this.colorize(message as string, logLevel);
  }

  protected colorize(message: string, logLevel: LogLevel) {
    const color = this.getColorByLogLevel(logLevel);
    return color(message);
  }

  protected printStackTrace(stack: string) {
    if (!stack) {
      return;
    }
    typeof window === "undefined" ? process.stderr.write(`${stack}\n`) : console.log(`${stack}\n`);
  }

  private updateAndGetTimestampDiff(): string {
    const includeTimestamp = ConsoleLogger.lastTimestampAt && this.options?.timestamp;
    const result = includeTimestamp
      ? this.formatTimestampDiff(Date.now() - ConsoleLogger.lastTimestampAt!)
      : "";
    ConsoleLogger.lastTimestampAt = Date.now();
    return result;
  }

  protected formatTimestampDiff(timestampDiff: number) {
    return yellow(` +${timestampDiff}ms`);
  }

  private getContextAndMessagesToPrint(args: unknown[]) {
    if (args?.length <= 1) {
      return { messages: args, context: this.context };
    }
    const lastElement = args[args.length - 1];
    const isContext = isString(lastElement);
    if (!isContext) {
      return { messages: args, context: this.context };
    }
    return {
      context: lastElement as string,
      messages: args.slice(0, args.length - 1),
    };
  }

  private getContextAndStackAndMessagesToPrint(args: unknown[]) {
    const { messages, context } = this.getContextAndMessagesToPrint(args);
    if (messages?.length <= 1) {
      return { messages, context };
    }
    const lastElement = messages[messages.length - 1];
    const isStack = isString(lastElement);
    if (!isStack) {
      return { messages, context };
    }
    return {
      stack: lastElement as string,
      messages: messages.slice(0, messages.length - 1),
      context,
    };
  }

  private getColorByLogLevel(level: LogLevel) {
    return (text: string) => text;
    // switch (level) {
    //   case "debug":
    //     return clc.magentaBright;
    //   case "warn":
    //     return clc.yellow;
    //   case "error":
    //     return clc.red;
    //   default:
    //     return clc.green;
    // }
  }
}
