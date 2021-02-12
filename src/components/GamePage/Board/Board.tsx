import React, { useContext, useMemo, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket, storage } from '@/helpers'
import cx from 'classnames'

import s from './Board.module.scss'


const Card = ({ data, longestWord, onClick }) => {
  const { word, color, revealed } = data

  const className = cx(s.card, s[color], {
    [s.revealed]: revealed,
  })

  return (
    <div className={className} onClick={onClick}>
      <span className={s.cardTitle}>
        <span>{word}</span>
      </span>
      <span className={s.placeholder}>{longestWord}</span>
    </div>
  )
}

const getLongestWord = (arr): string => arr.reduce((a, b) => a.length < b.length ? b : a, '')

const Board = () => {
  const { cols, rows, cards, colors } = useContext(GameContext)
  const { player, revealedCards } = useContext(GameStateContext)

  const handleCardClick = useCallback(({ word, revealed }) => {
    if (!player || player.spymaster || revealed) {
      return
    }

    socket.emit('reveal card', { word })
  }, [ player ])

  const className = cx(s.board, {
    [s.active]: player,
    [s.spymaster]: player?.spymaster,
  })

  const style = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  }

  const modifiedCards = cards.map((word, index) => {
    const revealed = Boolean(revealedCards.find((card) => card.index === index))

    return {
      word,
      color: player?.spymaster || revealed ? colors[index] : null,
      revealed,
    }
  })

  const longestWord = useMemo(() => getLongestWord(cards), [ cards ])

  return (
    <div className={className} style={style}>
      {
        modifiedCards.map((card, index) => (
          <Card
            key={`${card.word}-${index}`}
            data={card}
            longestWord={longestWord}
            onClick={() => handleCardClick(card)}
          />
        ))
      }
    </div>
  )
}


export default Board
