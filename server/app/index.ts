import http from 'http'
import cors from 'cors'
import uniqid from 'uniqid'
import express from 'express'
import bodyParser from 'body-parser'
import createIO from 'socket.io'

import { en as enWords, ru as ruWords } from './words'


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


const words = {
  'english': enWords,
  'russian': ruWords,
}

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

const getGameData = ({ fieldSize = '5x5', language = 'English' }) => {
  const counts = {
    '36': [ 13, 12, 9, 2 ],
    '30': [ 11, 10, 8, 1 ],
    '25': [ 9, 8, 7, 1 ],
    '20': [ 7, 6, 6, 1 ],
  }

  const [ colCount, rowCount ] = fieldSize.split('x')
  const cellCount = Number(colCount) * Number(rowCount)
  
  const [ count1, count2, neutralCount, blackCount ] = counts[String(cellCount)]
  
  const redCount = Math.round(Math.random()) ? count1 : count2
  const blueCount = count1 + count2 - redCount

  const colors = shuffle([
    ...new Array(redCount).fill('red'),
    ...new Array(blueCount).fill('blue'),
    ...new Array(neutralCount).fill('neutral'),
    ...new Array(blackCount).fill('black'),
  ])

  const cards = getRandomizedArr(words[language.toLowerCase()], cellCount)

  return {
    cards,
    colors
  }
}

const games: { [key: string]: Game } = {}

// https://socket.io/docs/emit-cheatsheet/

type SocketState = {
  name: string
  color: TeamColor
}

io.on('connection', (socket: any) => {
  console.log('player connected')

  socket.state = {} as SocketState

  socket.on('login', ({ name, color }: { name: string, color: TeamColor }) => {
    socket.state.name = name
    socket.state.color = color
    socket.emit('logged in')
  })

  socket.on('create game', ({ fieldSize, language }) => {
    const gameId = uniqid()
    const { cards, colors } = getGameData({ fieldSize, language })

    games[gameId] = {
      id: gameId,
      creator: socket.state.name,
      players: [],
      cards,
      colors,
      revealedCards: [],
      winner: null,
    }

    socket.emit('game created', { gameId })
  })

  socket.on('join game', (gameId: string) => {
    const game = games[gameId]

    if (game) {
      const player: Player = socket.player || {
        name: socket.state.name,
        admin: socket.state.name === game.creator,
        color: socket.state.color || 'red',
        mode: 'player',
      }
  
      game.players.push(player)
  
      socket.state.game = game
      socket.state.player = player
      socket.emitGame = (event: string, message?: any) => socket.to(gameId).emit(event, message)
  
      socket.join(gameId)
      socket.emit('game joined', game)
      socket.emitGame('player joined game', player)
    }
    else {
      socket.emit('game not found', gameId)
    }
  })

  socket.on('leave game', (gameId?: string) => {
    const { game } = socket.state

    if (game && game.id === gameId) {
      leaveGame(gameId)
      socket.emit('game left')
    }
  })

  socket.on('change player color', (color: TeamColor) => {
    socket.state.color = color
    socket.state.player.color = color

    socket.emit('color changed', color)
    socket.emitGame('player changed color', { name: socket.state.player.name, color })
  })

  socket.on('change player mode', (mode: PlayerMode) => {
    socket.state.player.mode = mode

    socket.emit('mode changed', mode)
    socket.emitGame('player changed mode', { name: socket.state.player.name, mode })
  })

  socket.on('reveal card', (cardName: string) => {
    const { game, player } = socket.state

    if (game && !game.winner) {
      const index = game.cards.indexOf(cardName)
      const color = game.colors[index]

      if (index < 0) {
        return
      }

      game.revealedCards.push(cardName)

      socket.emit('card revealed', { name: cardName, color })
      socket.emitGame('card revealed', { name: cardName, color })

      if (color === 'black') {
        game.winner = player.color === 'red' ? 'blue' : 'red'

        socket.emit('game ended', { winner: game.winner, blackOpened: true })
        socket.emitGame('game ended', { winner: game.winner, blackOpened: true })
      }
      else {
        const { cards, colors } = game

        const namesToColors = cards.reduce((obj, cardName) => {
          obj[cardName] = colors[cards.indexOf(cardName)]
          return obj
        }, {})

        const unrevealedCount = cards.filter((cardName) => namesToColors[cardName] === player.color).length

        if (unrevealedCount === 0) {
          game.winner = player.color

          socket.emit('game ended', { winner: game.winner })
          socket.emitGame('game ended', { winner: game.winner })
        }
      }
    }
  })

  // socket.on('start new game', () => {
  //   const prevGame = socket.game
  //   const newGame = createGame()

  //   if (prevGame) {
  //     newGame.players = prevGame.players.map((player) => ({
  //       ...player,
  //       mode: 'player',
  //     }))
  //   }

  //   io.of('/').in(prevGame.id).clients((err, clients) => {
  //     if (!err && clients) {
  //       clients.forEach((socketId) => {
  //         const socket = io.of('/').sockets[socketId]

  //         if (prevGame) {
  //           socket.leave(prevGame.id)
  //         }

  //         socket.game = newGame
  //         socket.join(newGame.id)
  //         io.to(socketId).emit('new game started', newGame)
  //       })
  //     }
  //   })
  // })

  socket.on('disconnect', () => {
    console.log('player disconnected', socket.state.player && socket.state.player.name)

    if (socket.state.game) {
      leaveGame(socket.state.game.id)
    }
  })

  const leaveGame = (gameId: string) => {
    socket.leave(gameId)
    socket.emitGame('player left game', socket.state.player.name)

    socket.state.game.players = socket.state.game.players.filter(({ name }) => name !== socket.state.player.name)
    socket.state.game = null
    socket.state.player = null
  }
})
