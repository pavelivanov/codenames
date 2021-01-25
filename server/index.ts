import './sentry'
import 'source-map-support/register'

import path from 'path'
import cors from 'cors'
import polka from 'polka'
import serveStatic from 'serve-static'

import render from './middleware/render'
import device from './middleware/device'
import requestState from './middleware/requestState'
import cookie from './middleware/cookie'
import loggerOnError from './middleware/loggerOnError'
import requestContext from './middleware/requestContext'


const port = parseInt(process.env.PORT) || 3000
const app = polka({ onError: loggerOnError })
const serve = serveStatic(path.resolve('build/client'), { index: false })

app.use(serve)
// We shouldn't have cors here, it's only for testing
app.use(cors({
  // https://www.apollographql.com/docs/react/networking/authentication/
  credentials: true,
  origin: '*',
}))
app.use(requestState)
app.use(requestContext)
app.use(cookie)
app.use(device)
app.use(...render)

app.listen(port, (err) => {
  if (err) {
    throw err
  }

  console.log(`SSR is running on localhost:${port}`)
})


export default app
