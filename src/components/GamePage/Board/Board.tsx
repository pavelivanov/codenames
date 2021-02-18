import React, { useContext, useMemo, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { openNotification } from '@/notifications'
import { socket } from '@/helpers'
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
  const { player, players, revealedCards, isFinished } = useContext(GameStateContext)

  const areBothTeamsHaveSpymaster = players.filter(({ spymaster }) => spymaster).length === 2

  const handleCardClick = useCallback(({ word, revealed }) => {
    if (!player || player.spymaster || revealed) {
      return
    }

    if (!areBothTeamsHaveSpymaster) {
      openNotification('Both teams should have a spymaster!')
      return
    }

    socket.emit('reveal card', { word })
  }, [ player, areBothTeamsHaveSpymaster ])

  const className = cx(s.board, {
    [s.active]: player,
    [s.spymaster]: !isFinished && player?.spymaster,
    [s.finished]: isFinished,
  })

  const style = {
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
  }

  const modifiedCards = cards.map((word, index) => {
    const revealed = Boolean(revealedCards.find((card) => card.index === index))

    return {
      word,
      color: player?.spymaster || revealed || isFinished ? colors[index] : null,
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
