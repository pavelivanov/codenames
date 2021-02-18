import React, { useContext, useCallback } from 'react'
import { GameStateContext } from '@/helpers/providers'
import { socket } from '@/helpers'
import cx from 'classnames'

import s from './Header.module.scss'


const Header = () => {
  const { isFinished } = useContext(GameStateContext)

  const handleClick = useCallback(() => {
    socket.emit('create new game')
  }, [])

  return (
    <div className={cx(s.container, { [s.visible]: isFinished })}>
      <div className={s.content}>
        <button className={s.button} onClick={handleClick}>Create new game</button>
      </div>
    </div>
  )
}


export default Header
