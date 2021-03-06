import http from 'http'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { v4 as uuidv4 } from 'uuid'
import { Server } from 'socket.io'

import { Game, createBoard, unhashColors } from './util'


const port = 3007
const app = express()
const server = http.createServer(app)
const router = express.Router()

const io = new Server({
  // path: '/test',
  serveClient: false,
  // below are engine.IO options
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: process.env.NODE_ENV === 'development' ? 'http://local.codenames.wtf:3000' : 'https://codenames.wtf',
  },
})


app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/rest', router)
app.options('*', cors())



const games = new Map<string, Game>()

const createGame = ({ cols, rows, lang }): Game => {
  const { cards, colors } = createBoard({ cols, rows, lang })

  const id = uuidv4()
  const game = new Game({ id, lang, cols, rows, cards, colors })

  games.set(id, game)

  return game
}


router.get('/game/:id', (req, res) => {
  const { id } = req.params

  const game = games.get(id)

  if (!game) {
    res.status(404)
    res.send({ message: 'Game not found' })
  }
  else {
    res.send(game)
  }
})

router.post('/game', (req, res) => {
  const game = createGame(req.body)

  res.send(game)
})


io.attach(server)

server.listen(port, () => {
  console.log(`Socket server is running on localhost:${port}`)
})


io.on('connection', (socket: any) => {
  console.log('user connected', socket.id)

  socket.gameId = null
  socket.player = null

  const emitPlayers = (event, message?) => socket.to(socket.gameId).emit(event, message)
  const emitMyself = (event, message?) => socket.emit(event, message)

  socket.on('join game', ({ gameId, player }) => {
    let game = games.get(gameId)

    if (!game) {
      emitMyself('game not found', { gameId })
      return
    }

    if (game.state.players.find((p) => p.id === player?.id)) {
      return
    }

    socket.join(gameId)

    socket.gameId = gameId

    if (player) {
      // for example Alice becomes a spymaster in red team, then she disconnects
      // Bob becomes a spymaster in red team, Alice comes back
      // Alice should loose spymaster status
      const isSpymasterExist = (
        player.spymaster
        && game.state.players.filter((p) => (
          p.id !== player.id
          && p.color === player.color
          && p.spymaster
        )).length !== 0
      )

      if (isSpymasterExist) {
        player.spymaster = false
      }

      socket.player = player
      game.addPlayer(socket.player)
    }

    emitMyself('game joined', { game })

    if (player) {
      emitPlayers('team joined', { player })
    }
  })

  socket.on('join team', ({ name, color }) => {
    const game = games.get(socket.gameId)

    if (!game) {
      emitMyself('game not found', { gameId: socket.gameId })
      return
    }

    const player: Player = {
      id: uuidv4(),
      name,
      color,
      spymaster: false,
    }

    socket.player = player
    game.addPlayer(player)

    emitMyself('team joined', { player, self: true })
    emitPlayers('team joined', { player })
  })

  socket.on('reveal card', ({ word }) => {
    if (!socket.player || socket.player.spymaster) {
      return
    }

    const game = games.get(socket.gameId)
    const revealed = game.isCardRevealed(word)
    let isFinished = game.state.isFinished

    if (revealed || isFinished) {
      return
    }

    const playerName = socket.player.name
    const index = game.revealCard({ word, playerName })
    isFinished = game.state.isFinished

    emitMyself('card revealed', { index, playerName, isFinished })
    emitPlayers('card revealed', { index, playerName, isFinished })
  })

  socket.on('become spymaster', () => {
    const game = games.get(socket.gameId)

    if (!game) {
      return
    }

    const spymaster = game.state.players.find((player) => player.color === socket.player.color && socket.player.spymaster)

    if (!spymaster) {
      socket.player.spymaster = true

      const player = game.changePlayer(socket.player.id, { spymaster: true })

      emitMyself('player changed', { player, self: true })
      emitPlayers('player changed', { player })
    }
  })

  socket.on('change team', () => {
    const game = games.get(socket.gameId)

    if (!game) {
      return
    }

    const player = game.changePlayerColor(socket.player.id)

    emitMyself('player changed', { player, self: true })
    emitPlayers('player changed', { player })
  })

  socket.on('leave team', () => {
    const game = games.get(socket.gameId)
    const playerId = socket.player?.id

    if (!game || !playerId) {
      return
    }

    game.removePlayer(playerId)

    emitMyself('player left', { playerId, self: true })
    emitPlayers('player left', { playerId })

    socket.player = null
  })

  socket.on('create new game', () => {
    const game = games.get(socket.gameId)
    const playerId = socket.player?.id

    if (!game || !playerId) {
      return
    }

    const { cols, rows, lang } = game

    const newGame = createGame({ cols, rows, lang })

    emitMyself('new game created', { gameId: newGame.id })
    emitPlayers('new game created', { gameId: newGame.id })
  })

  const handleDisconnectGame = () => {
    console.log('user disconnected', socket.id)

    const game = games.get(socket.gameId)

    if (!game) {
      return
    }

    const playerId = socket.player?.id

    game.removePlayer(playerId)

    emitPlayers('player left', { playerId })

    socket.gameId = null
    socket.player = null
  }

  socket.on('left game', handleDisconnectGame)
  socket.on('disconnect', handleDisconnectGame)
})
