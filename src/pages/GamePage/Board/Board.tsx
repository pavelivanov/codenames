import React, { useContext, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket, storage } from '@/helpers'

import s from './Board.module.scss'


const Card = ({ data, onClick }) => {
  const { word, color, revealed } = data

  return (
    <div className={s.cell} style={{ backgroundColor: revealed ? color : null }} onClick={onClick}>
      <span className={s.cellTitle}>{word}</span>
    </div>
  )
}

const Board = () => {
  const { cols, rows, cards } = useContext(GameContext)
  const { player, revealedCards } = useContext(GameStateContext)

  const handleCardClick = useCallback(({ word, revealed }) => {
    console.log(555, player, revealed)

    if (!player || player.spymaster || revealed) {
      return
    }

    socket.emit('reveal card', { word })
  }, [ player ])

  const style = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  }

  const modifiedCards = cards.map((word) => ({
    word,
    color: revealedCards[word],
    revealed: Boolean(revealedCards[word]),
  }))

  return (
    <div className={s.board} style={style}>
      {
        modifiedCards.map((card, index) => (
          <Card
            key={`${card.word}-${index}`}
            data={card}
            onClick={() => handleCardClick(card)}
          />
        ))
      }
    </div>
  )
}


export default Board
