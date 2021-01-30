import React, { useContext, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket, storage } from '@/helpers'

import s from './Board.module.scss'


const Card = ({ data, onClick }) => {
  const { word, color, revealed } = data

  return (
    <div className={s.cell} style={{ backgroundColor: color }} onClick={onClick}>
      <span className={s.cellTitle}>{word}</span>
    </div>
  )
}

const Board = () => {
  const { cols, rows, cards, colors } = useContext(GameContext)
  const { player, revealedCards } = useContext(GameStateContext)

  const handleCardClick = useCallback(({ word, revealed }) => {
    if (!player || player.spymaster || revealed) {
      return
    }

    socket.emit('reveal card', { word })
  }, [ player ])

  const style = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  }

  const modifiedCards = cards.map((word, index) => ({
    word,
    color: player?.spymaster ? colors[index] : revealedCards[word],
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
