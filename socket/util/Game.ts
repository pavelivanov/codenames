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

  revealCard({ word, playerName }): number {
    const index = this.cards.indexOf(word)

    this.state.revealedCards.push({ index, playerName })

    return index
  }
}


export default Game
