import React, { useState, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import cx from 'classnames'

import s from './GameLink.scss'


const GameLink = () => {
  const { pathname } = useLocation()
  const [ copied, setCopiedState ] = useState(false)
  const link = `${window.location.origin}${pathname}`

  const handleCopy = useCallback(() => {
    setCopiedState(true)

    setTimeout(() => {
      setCopiedState(false)
    }, 3000)
  }, [])

  return (
    <div className={s.root}>
      send this link to friends
      <CopyToClipboard text={link} onCopy={handleCopy}>
        <span className={s.link}>{link}</span>
      </CopyToClipboard>
      <span className={cx(s.copied, { [s.visible]: copied })}>Copied</span>
    </div>
  )
}


export default React.memo(GameLink)