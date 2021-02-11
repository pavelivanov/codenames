/// <reference types="next" />
/// <reference types="next/types/global" />

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'

declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const scssClassNames: IClassNames

  export = scssClassNames
}

type Color = 'red' | 'blue' | 'neutral' | 'black'

type Player = {
  id: string
  name: string
  color: string
  spymaster: boolean
}

type GameBase = {
  id: string
  lang: string
  cols: number
  rows: number
  cards: string[]
}

type ServerGame = GameBase & {
  colors?: number[]
  state: {
    players: Player[]
    revealedCards: Array<{
      index: number
      playerName: string
    }>
  }
}

type ClientGame = GameBase & {
  colors?: Color[]
  state: {
    player: Player
    players: Player[]
    revealedCards: Array<{
      index: number
      playerName: string
    }>
  }
}
