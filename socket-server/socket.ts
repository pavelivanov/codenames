import uniqid from 'uniqid'
import createIO from 'socket.io'
import cron from 'node-cron'

import { server, router } from './express'
import { en as enWords, ru as ruWords } from './words'


router.get('/check-name-taken', (req, res) => {
  const { gameId, name } = req.query as { gameId: string, name: string }

  if (!games[gameId]) {
    res.status(404)
    res.send({ message: 'Game with this ID not found' })
  }
  else {
    const taken = Boolean(
      games[gameId]
      && games[gameId].players.find((player) => (
        player.name.toLowerCase() === name.toLowerCase()
      ))
    )

    res.send({ taken })
  }
})

router.get('/games', (req, res) => {
  if (req.query.secret === 'dfvgbh') {
    const items = Object.keys(games).reduce(((arr, gameId) => [ ...arr, games[gameId] ]), [])

    res.send({ items })
  }
  else {
    res.status(403)
    res.send({ message: 'Get out!' })
  }
})

router.get('/clear', (req, res) => {
  if (req.query.secret === 'dfvgbh') {
    clearGames()
    res.status(204)
    res.end()
  }
})

const clearGames = () => {
  const now: number = +new Date()

  Object.keys(games).forEach((gameId) => {
    const { updatedAt } = games[gameId]

    const gameLastUpdateDate: number = +new Date(updatedAt)
    const diffDays = (now - gameLastUpdateDate) / (1000 * 60 * 60 * 24)

    if (diffDays > 0.5) {
      delete games[gameId]
    }
  })
}

if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 12 * * 1-5', clearGames, {
    timezone: 'Europe/Moscow',
    scheduled: true,
  })
}


// -------------------------------------------------------------------------


const io = createIO(server)

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

const hash = (colors) => {
  const hashes = {
    red: [ 1, 5, 8, 13, 27, 33, 41, 56, 72 ],
    blue: [ 3, 7, 11, 29, 31, 37, 55, 67, 81 ],
    neutral: [ 2, 4, 9, 14, 28, 44, 59, 77, 80 ],
    black: [ 6, 10, 15, 22, 34, 36, 46 ],
  }

  return colors.map((color) => {
    const maxIndex  = hashes[color].length - 1
    const index     = Math.floor(Math.random() * maxIndex)

    return hashes[color][index]
  })
}


// --------------------------------------------------------------------------------------

const games: { [key: string]: Game } = {}

// https://socket.io/docs/emit-cheatsheet/

type SocketState = {
  name: string
  color: TeamColor
}

io.on('connection', (socket: any) => {
  console.log('player connected')

  socket.state = {} as SocketState

  const createGame = ({ fieldSize, language }) => {
    const gameId = uniqid()
    const { cards, colors } = getGameData({ fieldSize, language })

    games[gameId] = {
      id: gameId,
      fieldSize,
      language,
      creator: socket.state.name,
      players: [],
      cards,
      colors,
      revealedCards: [],
      winner: null,
      updatedAt: new Date(),
    }

    return games[gameId]
  }

  socket.on('create game', ({ fieldSize, language }) => {
    const game = createGame({ fieldSize, language })

    socket.emit('game created', { gameId: game.id })
  })

  socket.on('join game', ({ gameId, name, color }: { gameId: string, name: string, color: TeamColor }) => {
    const game = games[gameId]
    const playerColor = socket.state.color || color || 'red'

    if (game) {
      const player: Player = socket.state.player || {
        name,
        admin: name === game.creator,
        color: playerColor,
        mode: 'player',
      }

      game.players.push(player)
      game.updatedAt = new Date()

      socket.state.game = game
      socket.state.player = player
      socket.state.name = name
      socket.state.color = playerColor
      socket.emitGame = (event: string, message?: any) => socket.to(gameId).emit(event, message)

      socket.join(gameId)
      socket.emit('game joined', { ...game, colors: hash(game.colors) })
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
    try {
      socket.state.color = color
      socket.state.player.color = color

      socket.emit('color changed', color)
      socket.emitGame('player changed color', { name: socket.state.player.name, color })
    }
    catch (err) {
      console.error(err)
    }
  })

  socket.on('change player mode', (mode: PlayerMode) => {
    try {
      socket.state.player.mode = mode

      socket.emit('mode changed', mode)
      socket.emitGame('player changed mode', { name: socket.state.player.name, mode })
    }
    catch (err) {
      console.error(err)
    }
  })

  socket.on('reveal card', (cardName: string) => {
    const { game, player } = socket.state

    if (game && game.revealedCards.includes(cardName)) {
      return
    }

    if (game && !game.winner) {
      const openedCardIndex = game.cards.indexOf(cardName)
      const openedCardColor = game.colors[openedCardIndex]

      if (openedCardIndex < 0) {
        return
      }

      game.revealedCards.push(cardName)
      game.updatedAt = new Date()

      socket.emit('card revealed', { name: cardName, color: openedCardColor })
      socket.emitGame('card revealed', { name: cardName, color: openedCardColor })

      if (openedCardColor === 'black') {
        game.winner = player.color === 'red' ? 'blue' : 'red'

        socket.emit('game ended', { winner: game.winner, blackOpened: true })
        socket.emitGame('game ended', { winner: game.winner, blackOpened: true })
      }
      else {
        const { cards, colors, revealedCards } = game

        const namesToColors = cards.reduce((obj, cardName) => {
          obj[cardName] = colors[cards.indexOf(cardName)]
          return obj
        }, {})

        const totalCount      = cards.filter((cardName) => namesToColors[cardName] === openedCardColor).length
        const revealedCount   = revealedCards.filter((cardName) => namesToColors[cardName] === openedCardColor).length
        const unrevealedCount = totalCount - revealedCount

        if (unrevealedCount === 0) {
          game.winner = player.color

          socket.emit('game ended', { winner: game.winner })
          socket.emitGame('game ended', { winner: game.winner })
        }
      }
    }
  })

  socket.on('start new game', (prevGameId) => {
    const prevGame = games[prevGameId]

    if (!prevGame) {
      return
    }

    const newGame = createGame({
      fieldSize: prevGame.fieldSize,
      language: prevGame.language,
    })

    io.of('/').in(prevGameId).clients((err, clients) => {
      if (!err && clients) {
        clients.forEach((socketId) => {
          const socket = io.of('/').sockets[socketId]

          socket.leave(prevGameId)
          delete games[prevGameId]

          io.to(socketId).emit('new game started', newGame.id)
        })
      }
    })
  })

  socket.on('disconnect', () => {
    console.log('player disconnected', socket.state.player && socket.state.player.name)

    if (socket.state.game) {
      leaveGame(socket.state.game.id)
    }
  })

  const leaveGame = (gameId: string) => {
    socket.leave(gameId)
    socket.emitGame('player left game', socket.state.player.name)

    if (games[gameId]) {
      games[gameId].players = games[gameId].players.filter(({ name }) => name !== socket.state.player.name)
      games[gameId].updatedAt = new Date()

      if (games[gameId].players.length === 0) {
        setTimeout(() => {
          if (games[gameId] && games[gameId].players.length === 0) {
            delete games[gameId]
          }
        }, 2 * 60 * 1000)
      }
    }

    socket.state.game = null
    socket.state.player = null
  }
})
