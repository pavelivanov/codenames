import { CookieStorage, getSiteNoneCompatible } from 'cookie-storage'
import { getRequestContext } from 'request-context'


const cookie: Server.Middleware = (req, res, next) => {
  // check params for cookies
  const isSecure = req.headers['x-forwarded-proto'] === 'https'
  let isSiteNoneCompatible = false

  if (isSecure) {
    isSiteNoneCompatible = getSiteNoneCompatible(req.headers['user-agent'])
  }

  const cookie = new CookieStorage({
    isSiteNoneCompatible,
    isSecure,
    request: req,
    response: res,
  })

  // add to request context
  const context = getRequestContext()
  context.cookie = cookie

  next()
}


export default cookie
