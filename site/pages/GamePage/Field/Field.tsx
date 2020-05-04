import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useReducerState } from 'hooks'
import { useGameState } from 'game'
import socket from 'socket'
import cx from 'classnames'

import Card from './Card/Card'

import s from './Field.scss'


type State = {
  revealedCards: string[]
  spied: boolean
  gameEnded: boolean
}

type FieldProps = {
  mode: PlayerMode
  cards: string[]
  colors: CardColor[]
  revealedCards: string[]
  winner: TeamColor
}

const FieldWrapper = () => {
  const { me: { mode }, fieldSize, cards, colors, revealedCards, winner } = useGameState()

  return (
    <Field {...{ fieldSize, mode, cards, colors, revealedCards, winner }} />
  )
}

const Field: React.FunctionComponent<FieldProps> = React.memo((props) => {
  const { gameId } = useParams()
  const { fieldSize, mode: initialMode, cards, colors, revealedCards: initialRevealedCards, winner: initialWinner } = props

  const [ state, setState ] = useReducerState<State>({
    revealedCards: initialRevealedCards,
    spied: initialMode === 'spymaster',
    gameEnded: Boolean(initialWinner),
  })

  const { revealedCards, spied, gameEnded } = state

  useEffect(() => {
    const handleModeChange = (mode: PlayerMode) => {
      setState({ spied: mode === 'spymaster' })
    }

    const handleCardReveal = ({ name: cardName }: { name: string }) => {
      setState(({ revealedCards }) => ({
        revealedCards: [
          ...revealedCards,
          cardName,
        ],
      }))
    }

    const handleGameEnd = () => {
      setState({ gameEnded: true })
    }

    socket.on('mode changed', handleModeChange)
    socket.on('card revealed', handleCardReveal)
    socket.on('game ended', handleGameEnd)

    return () => {
      socket.off('mode changed', handleModeChange)
      socket.off('card revealed', handleCardReveal)
      socket.off('game ended', handleGameEnd)
    }
  }, [])

  const handleStartNewGame = useCallback(() => {
    socket.emit('start new game', gameId)
  }, [])

  return (
    <div>
      <div className={cx(s.cards, s[`size${fieldSize}`])}>
        {
          cards.map((name, index) => {
            const revealed = revealedCards.includes(name)
            const color = colors[index]

            return (
              <div key={name} className={s.cardContainer}>
                <Card {...{ name, color, revealed, spied, gameEnded }} />
              </div>
            )
          })
        }
      </div>
      {
        gameEnded && (
          <div className={s.buttonContainer}>
            <button className={s.startNewGameButton} onClick={handleStartNewGame}>Start new game</button>
          </div>
        )
      }
    </div>
  )
})


export default FieldWrapper
