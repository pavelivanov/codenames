import { parse, serialize } from 'cookie'
import logger from 'logger'


export type Options = {
  isSiteNoneCompatible?: boolean
  isSecure?: boolean
  request?: Server.Request
  response?: Server.Response
}

export type Attributes = {
  expires?: Date
  maxAge?: number
  httpOnly?: boolean
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Lax' | 'Strict' | 'None'
}

export type GetAttributes = {
  json?: boolean
}

export type SetAttributes = Attributes & {
  json?: boolean
}

type CookieCache = { [key:string]: string }

export interface CookieStorageInterface {
  getItem<T = any>(name: string, attributes?: GetAttributes): T
  setItem<T = any>(name: string, value: T, attributes?: SetAttributes): void
  setSessionItem<T = any>(name: string, value: T, attributes?: SetAttributes): void
  removeItem(name: string, attributes?: Attributes): void
}

const BACKEND_BLACK_LIST_COOKIES = [
  'test_abTests',
  'test_abTests.sig',
  'test_features',
  'test_features.sig',
]

class CookieStorage implements CookieStorageInterface {
  private readonly isSiteNoneCompatible: boolean
  private readonly isSecure: boolean
  private readonly request: Server.Request
  private readonly response: Server.Response
  private serverCookieCache: CookieCache = null

  constructor(options: Options) {
    const {
      isSiteNoneCompatible = true,
      isSecure = false,
      request,
      response,
    } = options

    this.isSiteNoneCompatible = isSiteNoneCompatible
    this.isSecure = isSecure
    this.request = request
    this.response = response
  }

  private getCookies(): CookieCache {
    if (__SERVER__) {
      if (!this.request) {
        throw new Error('Request should be defined')
      }

      // read request only once
      if (this.serverCookieCache === null) {
        this.serverCookieCache = parse(this.request.headers['cookie'] || '')
      }

      return this.serverCookieCache
    }
    else {
      // we should read client cookie every time
      return parse(document.cookie || '')
    }
  }

  private getResponseHeaders(): string[] {
    const headers = this.response.getHeader('Set-Cookie')

    if (Array.isArray(headers)) {
      return headers
    }

    if (typeof headers === 'string') {
      return [ headers ]
    }

    return []
  }

  private updateResponseHeader(updatedHeaders: string[]) {
    const newHeaders = this.getResponseHeaders().concat(updatedHeaders)

    this.response.setHeader('Set-Cookie', newHeaders)
  }

  // prepare cookie header string for api call
  getForRequest = (): string => {
    if (__SERVER__) {
      const cookies = this.getCookies()

      return Object.keys(cookies).reduce((result, cookieName) => {
        if (!BACKEND_BLACK_LIST_COOKIES.includes(cookieName)) {
          result.push(`${cookieName}=${encodeURIComponent(cookies[cookieName])}`)
        }

        return result
      }, []).join('; ')
    }

    return ''
  }

  // set cookies from set-cookie header from api call
  setFromResponse = (headers: string | string[]) => {
    if (__SERVER__) {
      // to optimize client build
      const setCookieParser = require('set-cookie-parser')

      // since fetch library provide multiple headers in one string we need to convert the string into an array
      const splitCookieHeaders = typeof headers === 'string'
        ? setCookieParser.splitCookiesString(headers)
        : headers

      // we pass header, because it's a fetch response, not http
      const newCookies = setCookieParser.parse(splitCookieHeaders, {
        decodeValues: true,
      })

      newCookies.forEach(({ name, value, ...attributes }) => {
        this.setItem(name, value, {
          // we have string values, so we need to keep them as stings
          json: false,
          ...attributes,
        })
      })
    }
  }

  getItem<T = any>(name: string, attributes?: GetAttributes): T {
    logger.debug(`Get cookie ${name}`)

    const { json = true } = attributes || {}

    const cookies = this.getCookies()
    const value = cookies[name]

    if (json) {
      try {
        return JSON.parse(value)
      }
      catch (error) {
        // @ts-ignore
        return value
      }
    }

    // @ts-ignore
    return value
  }

  setItem<T = any>(name: string, value: T, attributes?: SetAttributes) {
    const { json = true, ...restAttributes } = attributes || {}

    const cookieValue = json ? JSON.stringify(value) : value.toString()

    // check sameSite compatibility
    if (restAttributes.sameSite === 'None' && !this.isSiteNoneCompatible) {
      delete restAttributes.sameSite
    }

    const cookieAttributes = {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year,
      secure: this.isSecure,
      httpOnly: false,
      sameSite: 'Lax',
      domain: '.codenames.com',
      ...restAttributes,
    }

    let cookieHeader: string

    try {
      cookieHeader = serialize(name, cookieValue, cookieAttributes)
    }
    catch (error) {
      logger.error(error, {
        extra: {
          name,
          cookieAttributes,
        },
      })
      return
    }

    logger.debug(`Set cookie ${name}`)

    if (__SERVER__) {
      if (!this.response) {
        throw new Error('Response should be defined')
      }

      if (this.serverCookieCache === null) {
        // workaround to parse cookies before update
        this.getCookies()
      }

      // update cache
      this.serverCookieCache[name] = cookieValue

      this.updateResponseHeader([ cookieHeader ])
    }
    else {
      document.cookie = cookieHeader
    }
  }

  setSessionItem<T = any>(name: string, value: T, attributes?: SetAttributes) {
    this.setItem(name, value, {
      ...attributes,
      expires: null,
      maxAge: null,
    })
  }

  removeItem(name: string, attributes?: Attributes) {
    this.setItem<string>(name, '', {
      ...attributes,
      expires: new Date(0),
      maxAge: null,
    })
  }
}


export default CookieStorage
