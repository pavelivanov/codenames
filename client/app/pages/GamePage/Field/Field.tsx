import React, { useEffect, useCallback } from 'react'
import { useReducerState } from 'hooks'
import { useGameState } from 'game'
import socket from 'socket'

import { Row } from 'components'

import Card from './Card/Card'

import s from './Field.scss'


type State = {
  revealedCards: string[]
  spied: boolean
  // gameEnded: boolean
}

const Field = () => {
  const { me: { mode: initialMode }, cards, colors, revealedCards: initialRevealedCards, winner: initialWinner } = useGameState()

  const [ state, setState ] = useReducerState<State>({
    revealedCards: initialRevealedCards,
    spied: initialMode === 'spymaster',
    // gameEnded: Boolean(initialWinner),
  })

  const { revealedCards, spied, gameEnded } = state

  // useEffect(() => {
  //   setState({
  //     spied: initialMode === 'spymaster',
  //     revealedCards: initialRevealedCards,
  //     gameEnded: Boolean(initialWinner),
  //   })
  // }, [ initialMode, initialRevealedCards, initialWinner ])

  useEffect(() => {
    const handleModeChange = (mode) => {
      setState({ spied: mode === 'spymaster' })
    }

    const handleCardReveal = ({ name }) => {
      setState(({ revealedCards }) => ({
        revealedCards: [
          ...revealedCards,
          name,
        ]
      }))
    }

    // const handleGameEnd = () => {
    //   setState({ spied: false, gameEnded: true })
    // }

    socket.on('mode changed', handleModeChange)
    socket.on('card revealed', handleCardReveal)
    // socket.on('game ended', handleGameEnd)

    return () => {
      socket.off('mode changed', handleModeChange)
      socket.off('card revealed', handleCardReveal)
      // socket.off('game ended', handleGameEnd)
    }
  }, [])

  // const handleStartNewGame = useCallback(() => {
  //   socket.emit('start new game')
  // }, [])

  return (
    <div>
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
      {/*
        gameEnded && (
          <Row justify="center">
            <button className={s.button} type="button" onClick={handleStartNewGame}>Start new game</button>
          </Row>
        )
      */}
    </div>
  )
}


export default React.memo(Field)
