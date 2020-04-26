import React, { useEffect } from 'react'
import { useReducerState } from 'hooks'
import { useGameState } from 'game'
import socket from 'socket'

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
  const { me: { mode }, cards, colors, revealedCards, winner } = useGameState()

  return (
    <Field {...{ mode, cards, colors, revealedCards, winner }} />
  )
}

const Field: React.FunctionComponent<FieldProps> = React.memo((props) => {
  const { mode: initialMode, cards, colors, revealedCards: initialRevealedCards, winner: initialWinner } = props

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

  return (
    <div>
      <div className={s.cards}>
        {
          cards.slice(0, 25).map((name, index) => {
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
    </div>
  )
})


export default FieldWrapper
