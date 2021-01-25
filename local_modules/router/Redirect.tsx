import { useRef } from 'preact/hooks'
import { useHistory } from './util/contexts'

import type { FunctionComponent } from 'preact'
import type { RedirectProps } from './types'


const Redirect: FunctionComponent<RedirectProps> = ({ to }) => {
  const history = useHistory()
  const ref = useRef(false)

  if (!ref.current) {
    ref.current = true
    history.replace(to)
  }

  return null
}


export default Redirect
