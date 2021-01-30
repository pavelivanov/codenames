import React, { useContext } from 'react'
import { GameProvider, GameStateProvider, GameContext, GameStateContext } from '@/helpers/providers'

import Board from './Board/Board'
import Teams from './Teams/Teams'

import s from './GamePage.module.scss'


const GamePage = () => {
  const game = useContext(GameContext)
  const state = useContext(GameStateContext)

  if (!game || !state) {
    return null
  }

  return (
    <div className={s.page}>
      <Board />
      <Teams />
      {/*<div className={s.chat}>*/}
      {/*  <div className={s.messages}>111</div>*/}
      {/*  <button className={s.newMessage}>*/}
      {/*    <InlineSvg src={messageImage} />*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  )
}


export default () => (
  <GameProvider>
    <GameStateProvider>
      <GamePage />
    </GameStateProvider>
  </GameProvider>
)
