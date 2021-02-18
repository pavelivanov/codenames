import { unhashColors } from './createBoard'


type GameOpts = Pick<Game, 'id' | 'lang' | 'cols' | 'rows' | 'cards' | 'colors'> & {
  state?: Game['state']
}

class Game {

  id: string
  lang: string
  cols: number
  rows: number
  cards: string[]
  colors: number[]
  state: {
    players: Player[]
    revealedCards: Array<{
      index: number
      playerName: string
    }>
    isFinished: boolean
  }

  constructor(props: GameOpts) {
    this.id = props.id
    this.lang = props.lang
    this.cols = props.cols
    this.rows = props.rows
    this.cards = props.cards
    this.colors = props.colors

    this.state = props.state || {
      players: [],
      revealedCards: [],
      isFinished: false,
    }
  }

  addPlayer(player: Player) {
    this.state.players.push(player)
  }

  changePlayerColor(playerId) {
    const player = this.state.players.find((player) => player.id === playerId)
    const index = this.state.players.indexOf(player)

    this.state.players[index] = {
      ...player,
      color: player.color === 'red' ? 'blue' : 'red',
    }

    return this.state.players[index]
  }

  changePlayer(playerId, values: Partial<Player>) {
    const player = this.state.players.find((player) => player.id === playerId)
    const index = this.state.players.indexOf(player)

    this.state.players[index] = {
      ...player,
      ...values,
    }

    return this.state.players[index]
  }

  removePlayer(playerId: string) {
    this.state.players = this.state.players.filter((player) => player.id !== playerId)
  }

  isCardRevealed(word): boolean {
    return this.state.revealedCards.findIndex(({ index }) => this.cards.indexOf(word) === index) >= 0
  }

  checkIfGameFinished() {
    const colors = unhashColors(this.colors)
    const revealedCards = this.state.revealedCards

    const getLeftCount = (color) => {
      const total = colors.filter((c) => c === color).length
      const revealedCount = revealedCards.map(({ index }) => colors[index]).filter((c) => c === color).length
      return total - revealedCount
    }

    const isBlueTeamWin = getLeftCount('blue') === 0
    const isRedTeamWin = getLeftCount('red') === 0
    const isBlackRevealed = revealedCards.some(({ index }) => colors[index] === 'black')

    const isGameEnded = isBlueTeamWin || isRedTeamWin || isBlackRevealed

    if (isGameEnded) {
      this.state.isFinished = true
    }
  }

  revealCard({ word, playerName }): number {
    const index = this.cards.indexOf(word)

    this.state.revealedCards.push({ index, playerName })
    this.checkIfGameFinished()

    return index
  }
}


export default Game
