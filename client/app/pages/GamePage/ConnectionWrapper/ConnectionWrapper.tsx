import React, { useEffect, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useReducerState } from 'hooks'
import cookie from 'js-cookie'
import socket from 'socket'

import { Loader, Row, Text } from 'components'

import Auth from './Auth/Auth'
import GameStateWrapper from './GameStateWrapper/GameStateWrapper'

import s from './ConnectionWrapper.scss'


type ConnectionState = {
  game: Game
  playerName: string
  isConnecting: boolean
  isConnected: boolean
}

const ConnectionWrapper = ({ children }) => {
  const history = useHistory()
  const { gameId } = useParams()

  const [ state, setState ] = useReducerState<ConnectionState>({
    game: null,
    playerName: cookie.get('playerName'),
    isConnecting: true,
    isConnected: false,
  })
  
  const { game, playerName, isConnecting, isConnected } = state

  console.log(444, { game, playerName, isConnecting, isConnected })

  useEffect(() => {
    if (playerName) {
      const playerColor = cookie.get('playerColor')

      socket.emit('login', { name: playerName, color: playerColor })
    }

    const handleLogin = () => {
      setState({ playerName: cookie.get('playerName') })
      socket.emit('join game', gameId)
    }

    const handleGameJoin = (game: Game) => {
      setState({ 
        game, 
        playerName: cookie.get('playerName'),
        isConnecting: false, 
        isConnected: true,
      })
    }

    const handleGameNotFound = () => {
      setState({ 
        isConnecting: false, 
        isConnected: false,
      })
    }

    socket.on('logged in', handleLogin)
    socket.on('game joined', handleGameJoin)
    socket.on('game not found', handleGameNotFound)

    return () => {
      socket.emit('leave game', gameId)
      socket.off('logged in', handleLogin)
      socket.off('game joined', handleGameJoin)
      socket.off('game not found', handleGameNotFound)
    }
  }, [ gameId ])

  const handleGoHome = useCallback(() => {
    history.push('/')
  }, [])

  if (!playerName) {
    return <Auth />
  }

  if (isConnecting) {
    return (
      <div className={s.wrapper}>
        <Loader />
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className={s.wrapper}>
        <Row>
          <Text size="38-48" light>Game not found</Text>
          <button className={s.button} type="button" onClick={handleGoHome}>Go Home</button>
        </Row>
      </div>
    )
  }

  return (
    <GameStateWrapper game={game}>
      {children}
    </GameStateWrapper>
  )
}


export default ConnectionWrapper
