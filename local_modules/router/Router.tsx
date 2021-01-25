import React from 'react'
import { useRef } from 'preact/hooks'

import locationHook from './util/locationHook'
import createMatcher from './util/createMatcher'
import createHistory from './util/createHistory'
import { PathnameContext, RouterContext, SearchParamsContext } from './util/contexts'

import type { FunctionComponent } from 'preact'
import type { RouterProps, RouterData } from './types'


const buildRouter = (opts: RouterProps = {}): RouterData => ({
  locationHook: opts.locationHook || locationHook,
  history: opts.history || createHistory(),
  matcher: createMatcher(),
})

const Router: FunctionComponent<RouterProps> = (props) => {
  const ref = useRef(buildRouter(props))
  const { pathname, searchParams } = ref.current.locationHook()

  return (
    <RouterContext.Provider value={ref.current}>
      <PathnameContext.Provider value={pathname}>
        <SearchParamsContext.Provider value={searchParams}>
          {props.children}
        </SearchParamsContext.Provider>
      </PathnameContext.Provider>
    </RouterContext.Provider>
  )
}


export default Router
