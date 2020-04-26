import http from 'http'
import cors from 'cors'
import uniqid from 'uniqid'
import express from 'express'
import bodyParser from 'body-parser'
import createIO from 'socket.io'

import { en as neWords, ru as ruWords } from './words'


const PORT = 3007
const app = express()
const server = http.createServer(app)
const io = createIO(server)
const router = express.Router()


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(router)

server.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`)
})


const shuffle = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))

    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }

  return arr
}

const getRandomizedArr = (arr, count) => {
  let len = arr.length
  const result = []
  const taken = []

  while (count--) {
    const index = Math.floor(Math.random() * len)

    result[count] = arr[index in taken ? taken[index] : index]
    taken[index] = --len in taken ? taken[len] : len
  }

  return result
}

const getCards = () => {
  const redCount      = 8 + Math.round(Math.random())
  const blueCount     = 17 - redCount
  const neutralCount  = 7
  const blackCount    = 1

  const colors = shuffle([
    ...new Array(redCount).fill('red'),
    ...new Array(blueCount).fill('blue'),
    ...new Array(neutralCount).fill('neutral'),
    ...new Array(blackCount).fill('black'),
  ])

  const cards = getRandomizedArr(ruWords, 25)

  return {
    cards,
    colors
  }
}

const games: { [key: string]: Game } = {}

// https://socket.io/docs/emit-cheatsheet/

io.on('connection', (socket) => {
  let isConnected = false

  console.log('player connected')

  socket.on('add player', (playername) => {
    if (isConnected) return

    isConnected = true

    socket.playername = playername

    socket.emit('login')
  })

  const createGame = (id?: string) => {
    const gameId = id || uniqid()
    const { cards, colors } = getCards()

    const game = {
      id: gameId,
      creator: socket.playername,
      players: [],
      cards,
      colors,
      revealedCards: [],
    }

    games[gameId] = game

    return game
  }

  socket.on('create game', () => {
    const game = createGame()

    socket.emit('game created', { gameId: game.id })
  })

  socket.on('join game', ({ gameId, color }) => {
    const game = games[gameId] || createGame(gameId)

    const player: Player = socket.player || {
      playername: socket.playername,
      admin: socket.playername === game.creator,
      color: color || 'red', // TODO get color by team sizes
      mode: 'player',
    }

    game.players.push(player)

    socket.game = game
    socket.player = player
    socket.emitGame = (event: string, message?: any) => socket.to(gameId).emit(event, message)

    socket.join(gameId)
    socket.emit('game joined', game)
    socket.emitGame('player joined game', player)
  })

  socket.on('leave game', () => {
    const { id: gameId } = socket.game

    if (socket.game) {
      leaveGame(gameId)
      socket.emit('game left')
    }
  })

  socket.on('change player color', (color) => {
    socket.player.color = color

    socket.game.players = socket.game.players.map((player) => {
      if (player.playername === socket.playername) {
        return socket.player
      }

      return player
    })

    socket.emit('color changed', color)
    socket.emitGame('player changed color', { playername: socket.playername, color })
  })

  socket.on('change player mode', (mode) => {
    socket.player.mode = mode

    socket.game.players = socket.game.players.map((player) => {
      if (player.playername === socket.playername) {
        return socket.player
      }

      return player
    })

    socket.emit('mode changed', mode)
    socket.emitGame('player changed mode', { playername: socket.playername, mode })
  })

  socket.on('reveal card', (name) => {
    if (socket.game && !socket.game.winner) {
      const index = socket.game.cards.indexOf(name)

      if (index < 0) {
        return
      }

      const color = socket.game.colors[index]
      const card = { name, color }

      socket.game.revealedCards.push(name)
      socket.emit('card revealed', card)
      socket.emitGame('card revealed', card)

      if (color === 'black') {
        socket.game.winner = socket.player.color === 'red' ? 'blue' : 'red'

        socket.emit('game ended', { winner: socket.game.winner, blackOpened: true })
        socket.emitGame('game ended', { winner: socket.game.winner, blackOpened: true })
      }
      else {
        const { cards, colors } = socket.game

        const namesToColors = cards.reduce((obj, name) => {
          obj[name] = colors[cards.indexOf(name)]
          return obj
        }, {})

        const unrevealedCount = cards.filter((name) => namesToColors[name] === socket.player.color).length

        if (unrevealedCount === 0) {
          socket.game.winner = socket.playercolor

          socket.emit('game ended', { winner: socket.game.winner })
          socket.emitGame('game ended', { winner: socket.game.winner })
        }
      }
    }
  })

  socket.on('disconnect', () => {
    if (isConnected) {
      console.log('player disconnected', socket.playername)

      isConnected = false

      if (socket.game) {
        const { id: gameId } = socket.game

        leaveGame(gameId)
      }
    }
  })

  const leaveGame = (gameId) => {
    socket.leave(gameId)
    socket.emitGame('player left game', socket.playername)

    socket.game.players = socket.game.players.filter(({ playername }) => playername !== socket.playername)
    socket.game = null
  }
})

