// src/utils/clientLogger.ts
export type LogLevel = "info" | "warn" | "error" | "debug";

const type = process.env.NEXT_PUBLIC_ENVIRONMENT === "production" ? "prod" : "dev";
export const isProd = type === "prod";
export const isDev = type === "dev";

type LogMessage = unknown;

class ClientLogger {
  private format(level: LogLevel, message: LogMessage[]): [string, string, ...LogMessage[]] {
    const timestamp = new Date().toISOString();
    let color = "";
    switch (level) {
      case "info":
        color = "color: blue";
        break;
      case "warn":
        color = "color: orange";
        break;
      case "error":
        color = "color: red";
        break;
      case "debug":
        color = "color: green";
        break;
    }
    return [`%c[${timestamp}] [${level.toUpperCase()}]`, color, ...message];
  }

  info(...args: LogMessage[]): void {
    if (isDev) {
      console.log(...this.format("info", args));
    }
  }

  warn(...args: LogMessage[]): void {
    if (isDev) {
      console.warn(...this.format("warn", args));
    }
  }

  error(...args: LogMessage[]): void {
    if (isDev) {
      console.error(...this.format("error", args));
    }
  }

  debug(...args: LogMessage[]): void {
    if (isDev) {
      console.debug(...this.format("debug", args));
    }
  }
}

const clientLogger = new ClientLogger();
export default clientLogger;