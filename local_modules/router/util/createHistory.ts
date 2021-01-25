import { History, HistoryMethodOptions } from '../types'


type NavigateOptions = HistoryMethodOptions & { to: string, replace: boolean }

const navigate = ({ to, searchParams, title, state, replace }: NavigateOptions) => {
  let href = to
  if (searchParams) {
    href += `?${new URLSearchParams(searchParams).toString()}`
  }

  history[replace ? 'replaceState' : 'pushState'](state || null, title || null, href)
}

const createHistory = (): History => ({
  push: (to, { searchParams, title, state } = {}) => navigate({ to, searchParams, title, state, replace: false }),
  replace: (to, { searchParams, title, state } = {}) => navigate({ to, searchParams, title, state, replace: true }),
})


export default createHistory
