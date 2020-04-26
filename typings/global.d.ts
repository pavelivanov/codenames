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
type CardColor = 'red' | 'blue' | 'neutral'
type PlayerMode = 'player' | 'spymaster'

type Player = {
  playername: string
  admin?: boolean
  color: TeamColor
  mode: PlayerMode
}

type Game = {
  id: string
  creator: string
  players: Player[]
  cards: string[]
  colors: CardColor[]
  revealedCards: string[]
}
