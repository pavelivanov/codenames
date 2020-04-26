import React, { useEffect } from 'react'
import { useReducerState } from 'hooks'
import { GameState, GameStateContext } from 'game'
import cookie from 'js-cookie'
import socket from 'socket'


const useGameState = (initialGameState: GameState) => {
  const [ state, setState ] = useReducerState<GameState>(initialGameState)
  const { me } = state

  useEffect(() => {
    const handlePlayerJoinGame = (player: Player) => {
      setState(({ players }) => ({
        players: [ ...players, player ],
      }))
    }

    const handlePlayerLeftGame = (playerName: string) => {
      setState(({ players }) => ({
        players: players.filter((player) => player.name !== playerName),
      }))
    }

    const handlePlayerChangeColor = ({ playerName, color }) => {
      setState(({ players }) => ({
        players: players.map((player) => {
          if (player.name === playerName) {
            return { ...player, color }
          }

          return player
        }),
      }))
    }

    const handleSelfColorChange = (color: TeamColor) => handlePlayerChangeColor({ playerName: me.name, color })

    const handlePlayerChangeMode = ({ playerName, mode }) => {
      setState(({ players }) => ({
        players: players.map((player) => {
          if (player.name === playerName) {
            return { ...player, mode }
          }

          return player
        }), 
      }))
    }

    const handleSelfModeChange = (mode: PlayerMode) => handlePlayerChangeMode({ playerName: me.name, mode })

    const handleGameEnd = () => {
      setState(({ players }) => ({
        players: players.map((player) => ({
          ...player,
          mode: 'player',
        })),
      }))
    }

    socket.on('player joined game', handlePlayerJoinGame)
    socket.on('player left game', handlePlayerLeftGame)
    socket.on('color changed', handleSelfColorChange)
    socket.on('player changed color', handlePlayerChangeColor)
    socket.on('mode changed', handleSelfModeChange)
    socket.on('player changed mode', handlePlayerChangeMode)
    socket.on('game ended', handleGameEnd)

    return () => {
      socket.off('player joined game', handlePlayerJoinGame)
      socket.off('player left game', handlePlayerLeftGame)
      socket.off('color changed', handleSelfColorChange)
      socket.off('player changed color', handlePlayerChangeColor)
      socket.off('mode changed', handleSelfModeChange)
      socket.off('player changed mode', handlePlayerChangeMode)
      socket.off('game ended', handleGameEnd)
    }
  }, [])

  return state
}

type GameStateWrapperProps = {
  game: Game
}

const GameStateWrapper: React.FunctionComponent<GameStateWrapperProps> = ({ children, game }) => {
  const playerName = cookie.get('playerName')
  const me = game.players.find((player: Player) => player.name === playerName)
  const initialGameState = { ...game, me }

  const state = useGameState(initialGameState)

  return (
    <GameStateContext.Provider value={state}>
      {children}
    </GameStateContext.Provider>
  )
}


export default GameStateWrapper