import type { IncomingMessage } from 'http'
import type { Response as ExpressResponse } from 'express-serve-static-core'
import type { FilledContext } from 'react-helmet-async'
import type { LogEntry } from 'logger/types'
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import type { CookieStorage } from 'cookie-storage'


declare global {
  namespace Server {

    type State = {
      device: DeviceContext
      appHtml: string
      redirectUrl: string
      helmet: FilledContext['helmet']
      loadableTags: {
        scripts: string
        styles: string
      }
      assets: {
        scripts: string
        styles: string
      }
    }

    type RequestContext = {
      requestId?: string
      startTime?: number
      logs?: LogEntry[]
      apolloClient?: ApolloClient<NormalizedCacheObject>
      cookie?: CookieStorage
    }

    interface PolkaRequest {
      originalUrl: string
      path: string
      params: {
        [key: string]: string
      }
      search: string | null
      query: {
        [key: string]: string | string[]
      }
    }

    export interface Request extends IncomingMessage, PolkaRequest {
      state: State
    }

    export interface Response extends ExpressResponse {}

    export type Middleware = (req: Request, res: Response, next: any) => void
  }
}
