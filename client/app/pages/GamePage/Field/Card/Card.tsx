import React, { useRef, useCallback } from 'react'
import cx from 'classnames'
import socket from 'socket'

import s from './Card.scss'


type CardProps = {
  name: string
  color: CardColor
  revealed: boolean
  spied: boolean
  gameEnded: boolean
}

const Card: React.FunctionComponent<CardProps> = ({ name, color, revealed, spied, gameEnded }) => {
  const cardRef = useRef<HTMLDivElement>()
  const zIndexRef = useRef(20)

  const handleClick = useCallback(() => {
    if (!revealed && !spied && !gameEnded) {
      zIndexRef.current += 1
      cardRef.current.style.zIndex = String(zIndexRef.current)
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
      <div className={s.titleContainer}>
        <div className={s.title}>{name}</div>
      </div>
      <div className={s.background} />
    </div>
  )
}


export default React.memo(Card)
