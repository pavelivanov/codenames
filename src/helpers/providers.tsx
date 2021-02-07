import React, { useContext, useState, useEffect } from 'react'
import { socket, storage } from '@/helpers'
import { useRouter } from 'next/router'


const hashesMap = {
  red: [ 1, 5, 8, 13, 27, 33, 41, 56, 72 ],
  blue: [ 3, 7, 11, 29, 31, 37, 55, 67, 81 ],
  neutral: [ 2, 4, 9, 14, 28, 44, 59, 77, 80 ],
  black: [ 6, 10, 15, 22, 34, 36, 46 ],
}

const unhashColors = (colors: number[]): Color[] => (
  colors.map((hash) => {
    let result

    Object.keys(hashesMap).some((color) => {
      if (hashesMap[color].includes(hash)) {
        result = color
        return true
      }

      return false
    })

    return result
  })
)

type Game = Omit<ClientGame, 'state'>
type GameState = ClientGame['state']

export const GameContext = React.createContext<Game>(null)
export const GameStateContext = React.createContext<GameState>(null)

export const GameProvider = ({ children }) => {
  const router = useRouter()
  const [ game, setGame ] = useState<Game>()

  const gameId = router.query.id as string

  useEffect(() => {
    if (!gameId) {
      return
    }

    const player: Player = storage.getItem(gameId)

    socket.emit('join game', { gameId, player })

    const handleJoin = ({ game: { colors, state, ...rest } }: { game: ServerGame }) => {
      setGame({
        ...rest,
        colors: unhashColors(colors),
      })
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
  const [ player, setPlayer ] = useState<Player>()
  const [ players, setPlayers ] = useState<GameState['players']>([])
  const [ revealedCards, setRevealedCards ] = useState<GameState['revealedCards']>({})

  const state: GameState = {
    player,
    players,
    revealedCards,
  }

  useEffect(() => {
    const handleGameJoin = ({ game }) => {
      let player: Player = storage.getItem(game.id)

      if (player) {
        // for example Alice becomes a spymaster in red team, then she disconnects
        // Bob becomes a spymaster in red team, Alice comes back
        // Alice should loose spymaster status
        const isSpymasterExist = player.spymaster && game.state.players.filter((p) => p.color === player.color && p.spymaster).length !== 0

        if (isSpymasterExist) {
          player.spymaster = false
          storage.setItem(game.id, player)
        }
      }

      setPlayer(player)
      setPlayers(game.state.players)
      setRevealedCards(game.state.revealedCards)
    }

    const handlePlayerJoin = ({ player, self }) => {
      if (self) {
        storage.setItem(game.id, player)
        setPlayer(player)
      }

      setPlayers((players) => [ ...players, player ])
    }

    const handlePlayerChange = ({ player, self }) => {
      if (self) {
        storage.setItem(game.id, player)
        setPlayer(player)
      }

      setPlayers((players) => players.map((p) => {
        if (p.id === player.id) {
          return player
        }

        return p
      }))
    }

    const handleCardReveal = ({ word, color }) => {
      setRevealedCards((cards) => ({ ...cards, [word]: color }))
    }

    const handlePlayerLeft = ({ playerId, self }) => {
      if (self) {
        storage.setItem(game.id, null)
        setPlayer(null)
      }

      setPlayers((players) => players.filter((player) => player.id !== playerId))
    }

    socket.on('game joined', handleGameJoin)
    socket.on('team joined', handlePlayerJoin)
    socket.on('player changed', handlePlayerChange)
    socket.on('card revealed', handleCardReveal)
    socket.on('player left', handlePlayerLeft)

    return () => {
      socket.off('game joined', handleGameJoin)
      socket.off('team joined', handlePlayerJoin)
      socket.off('player changed', handlePlayerChange)
      socket.off('card revealed', handleCardReveal)
      socket.off('player left', handlePlayerLeft)
    }
  }, [ game ])

  return (
    <GameStateContext.Provider value={state}>
      {children}
    </GameStateContext.Provider>
  )
}
