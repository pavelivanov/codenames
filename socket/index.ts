import http from 'http'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import { v4 as uuidv4 } from 'uuid'
import { Server } from 'socket.io'

import Game from '../shared/Game'
import { createBoard } from './util'
import removeKey from '../src/helpers/removeKey'


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
  const { cols, rows, lang } = req.body
  const { cards, colors } = createBoard({ cols, rows, lang })

  const id = uuidv4()
  const game = new Game({ id, lang, cols, rows, cards, colors })

  games.set(id, game)
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

    socket.join(gameId)

    socket.gameId = gameId

    if (player) {
      socket.player = player
      game.addPlayer(socket.player)
    }

    if (!player || !player.spymaster) {
      game = removeKey(game, 'colors')
    }

    emitMyself('game joined', { game })

    if (player) {
      emitPlayers('team joined', { player })
    }
  })

  socket.on('join team', ({ name, color }) => {
    const player: CodeNames.Player = {
      id: uuidv4(),
      name,
      color,
      spymaster: false,
    }

    socket.player = player

    emitMyself('team joined', { player, myself: true })
    emitPlayers('team joined', { player })
  })

  socket.on('leave team', () => {
    const playerId = socket.player.id
    const game = games.get(socket.gameId)

    game.removePlayer(playerId)

    emitMyself('team left', { playerId, myself: true })
    emitPlayers('team left', { playerId })

    socket.player = null
  })

  socket.on('reveal card', ({ word }) => {
    if (!socket.player || socket.player.spymaster) {
      return
    }

    const game = games.get(socket.gameId)
    const revealed = game.isCardRevealed(word)

    if (revealed) {
      return
    }

    const color = game.revealCard(word)

    emitMyself('card revealed', { word, color })
    emitPlayers('card revealed', { word, color })
  })

  const handleDisconnectGame = () => {
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



  /*

  const joinTeam = ({ player }) => {
    if (!socket.gameId) {
      return
    }

    const game = games.get(socket.gameId)

    if (!game) {
      emitMyself('game not found', { id: socket.gameId })
      return
    }

    if (socketPlayer) {
      leaveTeam()
    }

    socketPlayer = {
      gameId: socket.gameId,
      id: socket.id,
      name: playerName,
      color,
    }

    game.teams[color].push(socketPlayer)

    emitMyself('player joined team', { player: socketPlayer })
    emitPlayers('player joined team', { player: socketPlayer })

    // todo for chat
    // emitMyself('team joined', { color, player, teams: game.teams })
    // emitPlayers('player joined team', { color, player, teams: game.teams })
  }

  const leaveTeam = () => {
    const game = games.get(socket.gameId)

    if (!game) {
      emitMyself('game not found', { id: socket.gameId })
      return
    }

    emitMyself('player left team', { player: socketPlayer })
    emitPlayers('player left team', { player: socketPlayer })

    removePlayerFromTeams({ game })
  }

  const revealCard = ({ word }) => {
    if (!socket.gameId || !socketPlayer) {
      return
    }

    const game = games.get(socket.gameId)

    if (!game) {
      emitMyself('game not found', { id: socket.gameId })
      return
    }

    const card = game.board.cards.find((card) => card.word === word)
    const index = game.board.cards.indexOf(card)

    // smbd already opened this card
    if (card.opened) {
      emitMyself('card revealed', { word })
      return
    }

    game.board.cards[index].opened = true

    emitMyself('card revealed', { word })
    emitPlayers('card revealed', { word })
  }

  const disconnect = () => {
    console.log('user disconnected', socket.id)

    if (socketPlayer) {
      leaveTeam()
      socket.leave(socketPlayer.gameId)
      socketPlayer = null
    }
  }

  socket.on('join game', joinGame)
  socket.on('leave game', leaveGame)

  socket.on('join team', joinTeam)
  socket.on('leave team', leaveTeam)

  socket.on('reveal card', revealCard)

  socket.on('disconnect', disconnect)
  */
})
