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

const Field = () => {
  const { me: { mode: initialMode }, cards, colors, revealedCards: initialRevealedCards } = useGameState()

  const [ state, setState ] = useReducerState<State>({
    revealedCards: initialRevealedCards,
    spied: initialMode === 'spymaster',
    gameEnded: false,
  })

  const { revealedCards, spied, gameEnded } = state

  useEffect(() => {
    socket.on('mode changed', (mode) => {
      setState({ spied: mode === 'spymaster' })
    })

    socket.on('card revealed', ({ name }) => {
      setState(({ revealedCards }) => ({
        revealedCards: [
          ...revealedCards,
          name,
        ]
      }))
    })

    socket.on('game ended', ({ winner, blackOpened }: { winner: TeamColor, blackOpened: boolean }) => {
      setState({ gameEnded: true })
    })
  }, [])

  return (
    <div className={s.cards}>
      {
        cards.slice(0, 25).map((name, index) => {
          const revealed = gameEnded || revealedCards.includes(name)
          const color = colors[index]

          return (
            <div key={name} className={s.cardContainer}>
              <Card {...{ name, color, revealed, spied, gameEnded }} />
            </div>
          )
        })
      }
    </div>
  )
}


export default React.memo(Field)
