import type { ComponentChildren, ComponentType, VNode } from 'preact'


export type Params = { [paramName: string]: string } | null
export type Pathname = string
export type Match = [ boolean, Params ]
export type MatcherFn = (pattern: string, path: Pathname) => Match

export type HistoryMethodOptions = {
  searchParams?: Params | string
  title?: string
  state?: any
}

type HistoryMethod = (to: string, options?: HistoryMethodOptions) => void

export type History = {
  push: HistoryMethod
  replace: HistoryMethod
}

export type LocationHook = () => {
  pathname: string
  searchParams: Params
}

export type RouterProps = {
  locationHook?: LocationHook
  history?: History
}

export type RouterData = {
  locationHook: LocationHook
  history: History
  matcher: MatcherFn
}

export type RouteProps = {
  path?: string
  match?: Match
  component?: ComponentType<any>
  children?: ((params: Params, props: any) => ComponentChildren) | ComponentChildren
} & {
  // Props passed to component
  [key: string]: any
}

export type SwitchProps = {
  location?: string
  children: VNode<any>[]
}

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string
  children: ComponentChildren
}

export type RedirectProps = {
  path?: string
  to: string
}
