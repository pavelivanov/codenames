import React, { useRef, useCallback } from 'react'
import cx from 'classnames'
import socket from 'socket'

import s from './Card.scss'


const Card = ({ name, color, revealed, spied, gameEnded }) => {
  const cardRef = useRef<HTMLDivElement>()
  const zIndexRef = useRef(20)

  const handleClick = useCallback(() => {
    if (!revealed && !spied && !gameEnded) {
      cardRef.current.style.zIndex = String(++zIndexRef.current)
      socket.emit('reveal card', name)
    }
  }, [ revealed, spied, gameEnded ])

  const cardClassName = cx(s.card, {
    [s[color]]: revealed || spied,
    [s.revealed]: revealed,
    [s.spied]: spied,
    [s.animation]: revealed,
  })

  return (
    <div ref={cardRef} className={cardClassName} onClick={handleClick}>
      <div className={s.content}>
        <div className={s.title}>{name}</div>
        <div className={s.backdrop} />
      </div>
    </div>
  )
}


export default React.memo(Card)
