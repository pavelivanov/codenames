import { useRef, useEffect, useState } from 'preact/hooks'
import type { LocationHook, Params } from '../types'
import getSearchParams from './getSearchParams'


// While History API does have `popstate` event, the only
// proper way to listen to changes via `push/replaceState`
// is to monkey-patch these methods.
//
// See https://stackoverflow.com/a/4585031
let patched

const patchHistoryEvents = () => {
  if (patched) {
    return
  }

  [ 'pushState', 'replaceState' ].forEach((type) => {
    const original = history[type]

    history[type] = function () {
      const result = original.apply(this, arguments)
      const event = new Event(type)
      // @ts-ignore
      event.arguments = arguments

      dispatchEvent(event)
      return result
    }
  })

  patched = true
}


const locationHook: LocationHook = () => {
  const [ pathname, setPathname ] = useState<string>(location.pathname)
  const [ searchParams, setSearchParams ] = useState<Params>(getSearchParams(location.search))
  const prevPath = useRef(location.pathname)
  const prevSearch = useRef(location.search)

  useEffect(() => {
    patchHistoryEvents()

    // this function checks if the location has been changed since the
    // last render and updates the state only when needed.
    // unfortunately, we can't rely on `path` value here, since it can be stale,
    // that's why we store the last pathname in a ref.
    const checkForUpdates = () => {
      if (prevPath.current !== location.pathname) {
        prevPath.current = location.pathname

        setPathname(location.pathname)
      }
      
      if (prevSearch.current !== location.search) {
        prevSearch.current = location.search
        setSearchParams(getSearchParams(location.search))
      }
    }

    const events = [ 'popstate', 'pushState', 'replaceState' ]
    events.forEach((event) => addEventListener(event, checkForUpdates))

    // it's possible that an setPath has occurred between render and the effect handler,
    // so we run additional check on mount to catch these updates. Based on:
    // https://gist.github.com/bvaughn/e25397f70e8c65b0ae0d7c90b731b189
    checkForUpdates()

    return () => {
      events.forEach((event) => removeEventListener(event, checkForUpdates))
    }
  }, [])

  return { pathname, searchParams } 
}


export default locationHook
