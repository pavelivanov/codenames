import * as Sentry from '@sentry/node'
import { getRequestContext } from 'request-context'
import type { Level, LogEntry, Middleware, MiddlewareNext } from '../types'
import { getSentryLevel, isLevelFit } from '../levels'


type Options = {
  captureLevel?: Level
}

// this middleware logs messages to sentry and sends logs from the request
function sentryMiddleware(options: Options): Middleware {
  const { captureLevel } = options

  return (entry: LogEntry, next: MiddlewareNext) => {
    const { level, message, contexts, extra } = entry
    const { requestId, logs } = getRequestContext()

    if (isLevelFit(level, captureLevel)) {
      if (Sentry.getCurrentHub()) {
        Sentry.withScope((scope) => {
          scope.setLevel(getSentryLevel(level))
          scope.clearBreadcrumbs()

          // we don't have requestId for pure-server logs
          if (requestId) {
            scope.setTag('requestId', requestId)
          }

          if (logs) {
            logs.forEach(({ message, level, contexts, extra }) => {
              scope.addBreadcrumb({
                category: 'log',
                level: getSentryLevel(level),
                message: String(message),
                data: {
                  contexts,
                  extra,
                },
              })
            })
          }

          if (message instanceof Error) {
            Sentry.captureException(message, { contexts, extra })
          }
          else {
            Sentry.captureMessage(message, { contexts, extra })
          }
        })
      }
    }

    next(entry)
  }
}


export default sentryMiddleware
