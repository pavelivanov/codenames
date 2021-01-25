import type { EntryData, Level, LeveledLogMethod, LogEntry, LoggerInterface, Middleware } from './types'


class Logger implements LoggerInterface {
  private middlewares: Middleware[] = []

  public use(...middlewares: Middleware[]): LoggerInterface {
    this.middlewares.push(...middlewares)
    return this
  }

  public fatal = this.createLevelMethod('fatal')
  public error = this.createLevelMethod('error')
  public warn = this.createLevelMethod('warn')
  public info = this.createLevelMethod('info')
  public debug = this.createLevelMethod('debug')

  public log(level: Level, message: Error | string, data?: EntryData): LoggerInterface {
    const entry: LogEntry = {
      ...data,
      level,
      message,
    }

    // call middlewares
    invokeMiddlewares(entry, this.middlewares)

    return this
  }

  private createLevelMethod(level: Level): LeveledLogMethod {
    return (message: Error | string, data?: EntryData): LoggerInterface => {
      return this.log(level, message, data)
    }
  }
}

// recursive function to call middlewares in sequence to process entry
function invokeMiddlewares(entry: LogEntry, middlewares: Middleware[]) {
  // add async if needed
  if (!middlewares.length) {
    return
  }

  const middleware = middlewares[0]

  middleware(entry, (newEntry) => {
    invokeMiddlewares(newEntry, middlewares.slice(1))
  })
}


export default Logger
