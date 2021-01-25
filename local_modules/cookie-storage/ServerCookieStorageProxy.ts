import { getRequestContext } from 'request-context'
import type { CookieStorageInterface, Attributes, GetAttributes, SetAttributes } from './CookieStorage'

// Special proxy class to use cookie storage from request context
class ServerCookieStorageProxy implements CookieStorageInterface {

  getItem<T = any>(name: string, attributes?: GetAttributes): T {
    const { cookie } = getRequestContext()

    return cookie.getItem<T>(name, attributes)
  }

  setItem<T = any>(name: string, value: T, attributes?: SetAttributes) {
    const { cookie } = getRequestContext()

    cookie.setItem<T>(name, value, attributes)
  }

  setSessionItem<T = any>(name: string, value: T, attributes?: SetAttributes) {
    const { cookie } = getRequestContext()

    cookie.setSessionItem<T>(name, value, attributes)
  }

  removeItem(name: string, attributes?: Attributes) {
    const { cookie } = getRequestContext()

    cookie.removeItem(name, attributes)
  }
}


export default ServerCookieStorageProxy
