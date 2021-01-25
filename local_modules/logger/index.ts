import type { LoggerInterface } from './types'


let logger: LoggerInterface

if (__SERVER__) {
  logger = require('./serverLogger').default
}
else {
  logger = require('./clientLogger').default
}


export default logger
