import React, { useCallback } from 'react'

import { useHistory } from './util/contexts'
import type { LinkProps } from './types'


const Link: React.FunctionComponent<LinkProps> = (props) => {
  const { to, href = to, children, onClick, ...rest } = props

  const history = useHistory()

  const handleClick = useCallback((event) => {
    // ignores the navigation when clicked using right mouse button or
    // by holding a special modifier key: ctrl, command, win, alt, shift
    if (
      event.ctrlKey
      || event.metaKey
      || event.altKey
      || event.shiftKey
      || event.button !== 0
    ) {
      return
    }

    event.preventDefault()
    history.push(href)

    if (typeof onClick === 'function') {
      onClick(event)
    }
  }, [ history, href, onClick ])

  // wraps children in `a` if needed
  const extraProps = {
    ...rest,
    href,
    onClick: handleClick,
  }

  return React.createElement('a', extraProps, children)
}


export default Link
