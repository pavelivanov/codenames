import CookieStorage, { CookieStorageInterface } from './CookieStorage'
import getSiteNoneCompatible from './getSiteNoneCompatible'


let cookieStorage: CookieStorageInterface

if (__SERVER__) {
  const ServerCookieStorageProxy = require('./ServerCookieStorageProxy').default

  cookieStorage = new ServerCookieStorageProxy()
}
else {
  // maybe it's better to move it to global variable
  const isSecure = location.protocol === 'https:'
  const isSiteNoneCompatible = getSiteNoneCompatible(window.navigator)

  // on client side we have one storage
  cookieStorage = new CookieStorage({
    isSecure,
    isSiteNoneCompatible,
  })
}

export { getSiteNoneCompatible, CookieStorage }

export default cookieStorage
