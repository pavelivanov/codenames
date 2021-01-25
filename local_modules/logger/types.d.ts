export type Level = 'fatal' | 'error' | 'warn' | 'http' | 'info' | 'debug' | 'verbose'

export type EntryData = {
  // for sentry
  contexts?: {
    // context can be only an object
    [key: string]: {
      [key: string]: any
    }
  }
  extra?: {
    [key: string]: any
  }
}

export type LogEntry = EntryData & {
  message: string | Error
  level: Level
}

export interface MiddlewareNext {
  (entry: LogEntry): void // add promise if needed
}

export interface Middleware {
  (entry: LogEntry, next: MiddlewareNext): void // add promise if needed
}

export interface LogMethod {
  (level: Level, message: string | Error, data?: EntryData): LoggerInterface
}

export interface LeveledLogMethod {
  (message: string | Error, data?: EntryData): LoggerInterface
}

export interface LoggerInterface {
  use(...middlewares: Middleware[]): LoggerInterface

  log: LogMethod
  error: LeveledLogMethod
  warn: LeveledLogMethod
  info: LeveledLogMethod
  debug: LeveledLogMethod
}

