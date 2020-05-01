import React, { useEffect, useCallback } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { useReducerState } from 'hooks'
import { request } from 'helpers'
import cookie from 'js-cookie'
import socket from 'socket'

import { Loader, Text } from 'components'

import Auth from './Auth/Auth'
import GameStateWrapper from './GameStateWrapper/GameStateWrapper'

import s from './ConnectionWrapper.scss'


type Hashes = { [K in CardColor]: number[] }

const unhash = (colors: number[]): CardColor[] => {
  const hashes: Hashes = {
    red: [ 1, 5, 8, 13, 27, 33, 41, 56, 72 ],
    blue: [ 3, 7, 11, 29, 31, 37, 55, 67, 81 ],
    neutral: [ 2, 4, 9, 14, 28, 44, 59, 77, 80 ],
    black: [ 6, 10, 15, 22, 34, 36, 46 ],
  }

  return colors.map((num) => {
    const colors = Object.keys(hashes) as CardColor[]
    let result: CardColor

    colors.some((color) => {
      const nums = hashes[color]

      return nums.some((unhashNum) => {
        const match = unhashNum === num

        if (match) {
          result = color
        }

        return match
      })
    })

    return result
  })
}

type ConnectionState = {
  game: Game
  playerNameTaken: boolean
  authRequired: boolean
  isConnecting: boolean
  isConnected: boolean
  error: string
}

const ConnectionWrapper = ({ children }) => {
  const location = useLocation()
  const history = useHistory()
  const { gameId } = useParams()

  const [ state, setState ] = useReducerState<ConnectionState>({
    game: null,
    playerNameTaken: false,
    authRequired: false,
    isConnecting: true,
    error: null,
  })

  const { game, playerNameTaken, authRequired, isConnecting, error } = state

  useEffect(() => {
    /*

      1. If has no "playerName" cookie - go to Auth

        1. ... emit "join game"

      2. If user has "playerName" cookie then check if name taken

      3. If name is taken - got to Auth with error (and clear "playerName" cookie)

        1. ... emit "join game"

      4. If name isn't taken - emit "join game"

     */

    let playerName = cookie.get('playerName')
    const playerColor = cookie.get('playerColor')
    const currentGameId = cookie.get('currentGameId')

    if (gameId !== currentGameId && !/newgame/.test(location.search)) {
      cookie.remove('playerName')
      playerName = null
    }

    if (!playerName) {
      setState({ authRequired: true })
    }
    else {
      request.get('/check-name-taken', {
        params: {
          gameId,
          name: playerName,
        },
      })
        // @ts-ignore
        .then(({ taken }) => {
          if (taken) {
            setState({
              authRequired: true,
              playerNameTaken: true,
            })
          }
          else {
            socket.emit('join game', { gameId, name: playerName, color: playerColor })
          }
        }, () => {
          setState({ error: 'Something went wrong' })
        })
    }

    const handleGameJoin = (game: Game & { colors: number[] }) => {
      const colors = unhash(game.colors)

      // if gameId not changed after page reload then leave playerName as is
      cookie.set('currentGameId', game.id)

      setState({
        game: { ...game, colors },
        playerNameTaken: false,
        authRequired: false,
        isConnecting: false,
        error: null,
      })
    }

    const handleGameNotFound = () => {
      setState({ error: 'Game not found!' })
    }

    socket.on('game joined', handleGameJoin)
    socket.on('game not found', handleGameNotFound)

    return () => {
      socket.emit('leave game', gameId)
      socket.off('game joined', handleGameJoin)
      socket.off('game not found', handleGameNotFound)
    }
  }, [])

  const handleGoHome = useCallback(() => {
    history.push('/')
  }, [])

  const handleAuthError = useCallback((err) => {
    const message = err || 'Something went wrong'

    setState({ error: message })
  }, [])

  if (error) {
    return (
      <div className={s.wrapper}>
        <Text size="38-48" light>{error}</Text>
        <button className={s.button} type="button" onClick={handleGoHome}>Go home</button>
      </div>
    )
  }

  if (authRequired) {
    return (
      <Auth playerNameTaken={playerNameTaken} onError={handleAuthError} />
    )
  }

  if (isConnecting) {
    return (
      <div className={s.wrapper}>
        <Loader />
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
