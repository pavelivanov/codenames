import { h } from 'preact'
import { RouteParamsContext } from './util/contexts'

import type { FunctionComponent } from 'preact'
import type { RouteProps } from './types'


const Route: FunctionComponent<RouteProps> = ({ path, match, component, children, ...props }) => {
  // `props.match` is present - Route is controlled by the Switch
  const [ matches, params ] = match

  if (!matches) {
    return null
  }

  let routeChildren

  // React-Router style `component` prop
  if (component) {
    routeChildren = h(component, props)
  }
  else if (typeof children === 'function') {
    routeChildren = children(params, props)
  }
  else {
    routeChildren = children
  }

  return h(RouteParamsContext.Provider, {
    value: params,
    children: routeChildren,
  })
}


export default Route
