type GameOpts = Pick<Game, 'id' | 'lang' | 'cols' | 'rows' | 'cards' | 'colors'> & {
  state?: Game['state']
}

class Game {

  id: string
  lang: string
  cols: number
  rows: number
  cards: string[]
  colors?: CodeNames.Color[] // for spymaster only
  state: {
    players: CodeNames.Player[]
    revealedCards: Record<string, CodeNames.Color>
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
      revealedCards: {},
    }
  }

  addPlayer(player: CodeNames.Player) {
    this.state.players.push(player)
  }

  removePlayer(playerId: string) {
    this.state.players = this.state.players.filter((player) => player.id !== playerId)
  }

  isCardRevealed(word): boolean {
    return Boolean(this.state.revealedCards[word])
  }

  revealCard(word): CodeNames.Color {
    const color = this.colors[this.cards.indexOf(word)]

    this.state.revealedCards[word] = color

    return color
  }
}


export default Game
