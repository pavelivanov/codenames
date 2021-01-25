import type { Level, LogEntry, Middleware, MiddlewareNext } from '../types'
import { getSentryLevel, isLevelFit } from '../levels'


type Options = {
  captureLevel?: Level
  breadcrumbsLevel?: Level
}

// this middleware logs messages to sentry
function sentryMiddleware(options: Options): Middleware {
  const { captureLevel, breadcrumbsLevel } = options

  return (entry: LogEntry, next: MiddlewareNext) => {
    const { level, message, contexts, extra } = entry

    if (window.Sentry) {
      if (isLevelFit(level, captureLevel)) {
        window.Sentry.withScope((scope) => {
          scope.setLevel(getSentryLevel(level))

          if (message instanceof Error) {
            window.Sentry.captureException(message, { contexts, extra })
          }
          else {
            window.Sentry.captureMessage(message, { contexts, extra })
          }
        })
      }
      else if (isLevelFit(level, breadcrumbsLevel)) {
        window.Sentry.addBreadcrumb({
          category: 'log',
          level: getSentryLevel(level),
          message: String(message),
          data: {
            contexts,
            extra,
          },
        })
      }
    }

    next(entry)
  }
}


export default sentryMiddleware
