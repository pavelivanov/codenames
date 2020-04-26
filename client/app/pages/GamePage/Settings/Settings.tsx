import React, { Fragment, useRef, useState, useCallback } from 'react'
import cx from 'classnames'

import s from './Settings.scss'

import settingsIcon from './images/settings.svg'
import closeIcon from './images/close.svg'

import PlayerColor from './PlayerColor/PlayerColor'
import PlayerMode from './PlayerMode/PlayerMode'


const Settings = () => {
  const [ active, setActive ] = useState(false)

  const iconRef = useRef<HTMLDivElement>()
  const contentRef = useRef<HTMLDivElement>()

  const animateNode = useCallback((node, reverse) => {
    const handleAnimationEnd = () => {
      if (!reverse) {
        node.classList.add(s.animated)
      }
      node.classList.remove(!reverse ? s.animation : s.reverseAnimation)
      node.removeEventListener('animationend', handleAnimationEnd)
    }

    node.classList.remove(s.animated)
    node.classList.add(!reverse ? s.animation : s.reverseAnimation)
    node.addEventListener('animationend', handleAnimationEnd)
  }, [])

  const handleClick = useCallback(() => {
    animateNode(contentRef.current, active)

    if (active) {
      iconRef.current.classList.remove(s.active)
    }
    else {
      iconRef.current.classList.add(s.active)
    }

    setActive((active) => !active)
  }, [ active ])

  return (
    <Fragment>
      <div ref={iconRef} className={s.settingsIcon} onClick={handleClick}>
        <img className={cx(s.icon, s.settings)} src={settingsIcon} alt="" />
        <img className={cx(s.icon, s.close)} src={closeIcon} alt="" />
      </div>
      <div ref={contentRef} className={s.content}>
        <div className={s.item}>
          <PlayerColor />
        </div>
        <div className={s.item}>
          <PlayerMode />
        </div>
      </div>
    </Fragment>
  )
}


export default Settings
