declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module '*.vtt';

declare module '*.scss' {
  const content: {
    [className: string]: string
  }
  export = content
}


interface Document {
  fullScreen: boolean
  webkitIsFullScreen: boolean
  mozFullScreen: boolean
  msFullscreenElement: boolean
  webkitCancelFullScreen: Function
  msExitFullscreen: Function
  exitFullscreen: () => Promise<void>
  mozCancelFullScreen: () => void
  webkitExitFullscreen: () => void
  fullscreenElement: () => void
  mozFullScreenElement: () => void
  webkitFullscreenElement: () => void
  webkitRequestFullScreen: () => void
}

interface Window {

}


type TeamColor = 'red' | 'blue'
type CardColor = 'red' | 'blue' | 'neutral' | 'black'
type PlayerMode = 'player' | 'spymaster'
type PlayerName = string

type Player = {
  name: PlayerName
  admin?: boolean
  color: TeamColor
  mode: PlayerMode
}

type Game = {
  id: string
  fieldSize: '6x6' | '6x5' | '5x5' | '5x4'
  language: string
  creator: string
  players: Player[]
  cards: string[]
  colors: CardColor[]
  revealedCards: string[]
  winner: TeamColor
  updatedAt: Date
}
