import React, { useContext, useState, useEffect } from 'react'
import { socket, storage } from '@/helpers'
import { useRouter } from 'next/router'
import { removeKey } from '@/helpers'
import Game from '@/shared/Game'


type State = Game['state'] & {
  player: CodeNames.Player
}

export const GameContext = React.createContext<Omit<Game, 'state'>>(null)
export const GameStateContext = React.createContext<State>(null)

export const GameProvider = ({ children }) => {
  const router = useRouter()
  const [ game, setGame ] = useState<Omit<Game, 'state'>>()

  const gameId = router.query.id as string

  useEffect(() => {
    if (!gameId) {
      return
    }

    const player: CodeNames.Player = storage.getItem(gameId)

    socket.emit('join game', { gameId, player })

    const handleJoin = ({ game }) => {
      setGame(removeKey(game, 'state'))
    }

    const handleNotFound = ({ gameId }) => {
      console.error(`Game "${gameId}" not found!`)
    }

    socket.on('game joined', handleJoin)
    socket.on('game not found', handleNotFound)

    return () => {
      socket.off('game joined', handleJoin)
      socket.off('game not found', handleNotFound)
    }
  }, [ gameId ])

  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  )
}

export const GameStateProvider = ({ children }) => {
  const game = useContext(GameContext)
  const [ player, setPlayer ] = useState<CodeNames.Player>()
  const [ players, setPlayers ] = useState<Game['state']['players']>([])
  const [ revealedCards, setRevealedCards ] = useState<Game['state']['revealedCards']>({})

  const state: State = {
    player,
    players,
    revealedCards,
  }

  useEffect(() => {
    if (game) {
      setPlayer(storage.getItem(game.id))
    }
  }, [ game ])

  useEffect(() => {
    const handleGameJoin = ({ game }) => {
      setPlayers(game.state.players)
      setRevealedCards(game.state.revealedCards)
    }

    const handlePlayerJoin = ({ player, myself }) => {
      if (myself) {
        storage.setItem(game?.id, player)
        setPlayer(player)
      }

      setPlayers((players) => [ ...players, player ])
    }

    const handlePlayerLeft = ({ playerId, myself }) => {
      if (myself) {
        storage.setItem(game?.id, null)
        setPlayer(null)
      }

      setPlayers((players) => players.filter((player) => player.id !== playerId))
    }

    const handleCardReveal = ({ word, color }) => {
      setRevealedCards((cards) => ({ ...cards, [word]: color }))
    }

    socket.on('game joined', handleGameJoin)
    socket.on('team joined', handlePlayerJoin)
    socket.on('team left', handlePlayerLeft)
    socket.on('card revealed', handleCardReveal)

    return () => {
      socket.off('game joined', handleGameJoin)
      socket.off('team joined', handlePlayerJoin)
      socket.off('team left', handlePlayerLeft)
      socket.off('card revealed', handleCardReveal)
    }
  }, [ game ])

  return (
    <GameStateContext.Provider value={state}>
      {children}
    </GameStateContext.Provider>
  )
}
