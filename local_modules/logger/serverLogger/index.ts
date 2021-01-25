import Logger from '../logger'
import collectorMiddleware from './collectorMiddleware'
import sentryMiddleware from './sentryMiddleware'


const logger = new Logger()

logger.use(collectorMiddleware())
logger.use(sentryMiddleware({ captureLevel: 'warn' }))


export default logger
