import type { Level, LogEntry, Middleware, MiddlewareNext } from '../types'
import { isLevelFit } from '../levels'


type Options = {
  level?: Level
}

function getConsoleMethod(level: Level) {
  if (typeof console.error === 'function' && (level === 'fatal' || level === 'error')) {
    return console.error
  }

  if (typeof console.warn === 'function' && level === 'warn') {
    return console.warn
  }

  if (typeof console.info === 'function' && level === 'info') {
    return console.info
  }

  if (typeof console.debug === 'function' && level === 'debug') {
    return console.debug
  }

  return console.log
}

// this middleware log all messages to console
function consoleMiddleware(options: Options): Middleware {
  const { level: middlewareLevel = 'debug' } = options

  return (entry: LogEntry, next: MiddlewareNext) => {
    const { level, message, contexts, extra } = entry

    if (isLevelFit(level, middlewareLevel)) {
      const method = getConsoleMethod(level)
      const args: any[] = [ message ]

      if (contexts) {
        args.push('\ncontexts', contexts)
      }

      if (extra) {
        args.push('\nextra', extra)
      }

      method(...args)
    }

    next(entry)
  }
}


export default consoleMiddleware
