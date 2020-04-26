import React, { useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useReducerState } from 'hooks'
import { GameState, GameStateContext } from 'game'
import cookie from 'js-cookie'
import socket from 'socket'

import { Loader } from 'components'

import Auth from './Auth/Auth'

import s from './ConnectionWrapper.scss'


type State = {
  playername: string
  isConnecting: boolean
  isConnected: boolean
}

const ConnectionWrapper = ({ children }) => {
  const playername = cookie.get('playername')

  const initialState = {
    playername,
    isConnecting: true,
    isConnected: false,
  }

  const initialGameState: GameState = {
    id: null,
    creator: null,
    me: null,
    players: null,
    cards: null,
    colors: null,
    revealedCards: null,
    winner: null,
  }

  const { gameId } = useParams()
  const [ state, setState ] = useReducerState<State>(initialState)
  const [ gameState, setGameState ] = useReducerState<Game>(initialGameState)
  const { isConnecting, isConnected } = state

  const joinGame = useCallback(() => {
    const color = cookie.get('color')

    socket.emit('join game', { gameId, color })
  }, [])

  useEffect(() => {
    if (playername) {
      socket.emit('login', playername)
    }

    const handleLogin = () => {
      setState({ playername: cookie.get('playername') })
      joinGame()
    }

    const handleGameJoin = (game: Game) => {
      setGameState(game)
      setState({ isConnecting: false, isConnected: true })
    }

    const handleNewGameStart = (game) => {
      setState({ isConnecting: true })

      setTimeout(() => {
        setGameState(game)
        setState({ isConnecting: false })
      }, 1000)
    }

    socket.on('logged in', handleLogin)
    socket.on('game joined', handleGameJoin)
    socket.on('new game started', handleNewGameStart)

    return () => {
      socket.emit('leave game', gameId)
      socket.off('logged in', handleLogin)
      socket.off('game joined', handleGameJoin)
      socket.off('new game started', handleNewGameStart)
    }
  }, [ gameId ])

  if (!playername) {
    return <Auth />
  }

  if (isConnecting) {
    return (
      <div className={s.loaderContainer}>
        <Loader />
      </div>
    )
  }

  if (!isConnected) {
    return <div>Game not found</div>
  }

  const myUsername = cookie.get('playername')
  const me = gameState.players.find((player) => player.playername === myUsername)

  return (
    <GameStateContext.Provider value={{ ...gameState, me }}>
      {children}
    </GameStateContext.Provider>
  )
}


export default ConnectionWrapper
