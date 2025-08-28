declare module 'next-logger' {
  interface LoggerOptions {
    color?: boolean;
    timestamp?: boolean;
    level?: 'info' | 'warn' | 'error' | 'debug';
  }

  interface Logger {
    info: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    error: (...args: any[]) => void;
    debug: (...args: any[]) => void;
    setOptions: (options: LoggerOptions) => void;
  }

  const logger: Logger;
  export default logger;
}
