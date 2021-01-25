import type { LogEntry, Middleware, MiddlewareNext } from '../types'
import { getRequestContext } from 'request-context'


// this middleware saves all messages to async context
function collectorMiddleware(): Middleware {
  return (entry: LogEntry, next: MiddlewareNext) => {
    const context = getRequestContext()

    if (context.requestId) {
      if (!context.logs) {
        context.logs = []
      }

      context.logs.push(entry)
    }

    next(entry)
  }
}


export default collectorMiddleware
