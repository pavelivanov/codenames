import { createContext } from 'preact'
import { useContext } from 'preact/hooks'

import type { RouterData, Pathname, Params } from '../types'


export const RouterContext = createContext<RouterData>(null)
export const useRouter = () => useContext(RouterContext)
export const useHistory = () => useContext(RouterContext).history

export const PathnameContext = createContext<Pathname>('')
export const usePathname = () => useContext(PathnameContext)

export const SearchParamsContext = createContext<Params>({})
export const useSearchParams = () => useContext(SearchParamsContext)

export const RouteParamsContext = createContext<Params>({})
export const useParams = () => useContext(RouteParamsContext)
