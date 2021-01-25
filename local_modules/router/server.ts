import getSearchParams from './util/getSearchParams'
import type { HistoryMethod, LocationHook } from './types'


export type RouterContext = {
  url: string
}

export const createHistory = (context: RouterContext) => {
  const navigate: HistoryMethod = (to, { searchParams } = {}) => {
    let href = to

    if (searchParams) {
      href += `?${new URLSearchParams(searchParams).toString()}`
    }

    context.url = href
  }

  return {
    push: navigate,
    replace: navigate,
  }
}

export const createLocationHook = (url: string): LocationHook => {
  const [ pathname, search ] = url.split('?')
  const searchParams = getSearchParams(search)

  return () => ({ pathname, searchParams })
}

export { default as Router } from './Router'
