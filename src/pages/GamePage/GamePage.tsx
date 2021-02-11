import React, { useContext } from 'react'
import { GameProvider, GameStateProvider, GameContext, GameStateContext } from '@/helpers/providers'

import Sidebar from '@/components/GamePage/Sidebar/Sidebar'
import Board from '@/components/GamePage/Board/Board'

import s from './GamePage.module.scss'


const Content = () => {
  const game = useContext(GameContext)
  const state = useContext(GameStateContext)

  if (!game || !state) {
    return null
  }

  return (
    <div className={s.page}>
      <div className={s.sidebar}>
        <Sidebar />
      </div>
      <div className={s.content}>
        <Board />
      </div>
    </div>
  )
}

const GamePage = () => (
  <GameProvider>
    <GameStateProvider>
      <Content />
    </GameStateProvider>
  </GameProvider>
)


export default GamePage
