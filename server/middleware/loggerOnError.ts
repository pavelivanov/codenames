import logger from 'logger'
import { IncomingMessage, ServerResponse, STATUS_CODES } from 'http'


const loggerOnError = (err: string | Error & { code?: number, status?: number }, req: IncomingMessage, res: ServerResponse) => {
  logger.error(err)

  let code
  let message

  if (err instanceof Error) {
    code = err.code || err.status
    message = err.message
  }

  code = code || 500
  message = message || String(err) || STATUS_CODES[code]

  // TODO add error page
  res.writeHead(code, { 'Content-Type': 'text/html' })
  res.write(message)
  res.end()
}


export default loggerOnError
