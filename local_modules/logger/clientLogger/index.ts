import Logger from '../logger'
import consoleMiddleware from './consoleMiddleware'
import sentryMiddleware from './sentryMiddleware'


const logger = new Logger()

logger.use(
  consoleMiddleware({ level: __DEV__ ? 'debug' : 'warn' }),
  sentryMiddleware({ captureLevel: 'warn', breadcrumbsLevel: 'debug' })
)

// all globals handler will be added by sentry itself.


export default logger
