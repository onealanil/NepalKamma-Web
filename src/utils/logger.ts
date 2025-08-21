// src/utils/clientLogger.ts
export type LogLevel = "info" | "warn" | "error" | "debug";

class ClientLogger {
  private format(level: LogLevel, message: any[]) {
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

  info(...args: any[]) {
    console.log(...this.format("info", args));
  }
  warn(...args: any[]) {
    console.warn(...this.format("warn", args));
  }
  error(...args: any[]) {
    console.error(...this.format("error", args));
  }
  debug(...args: any[]) {
    console.debug(...this.format("debug", args));
  }
}

const clientLogger = new ClientLogger();
export default clientLogger;
