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
    <>
      <div className={s.warning}>
        <div className={s.icon}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488.631 488.631">
            <g fill="currentColor">
              <path
                d="M443.762 251.057H282.306v34.625l161.592.072-.079 168.314h-.057l-161.464-.064c-.006 12.669-3.686 24.393-9.667 34.626h171.131c19.138 0 34.699-15.561 34.699-34.697V285.754c0-19.12-15.561-34.697-34.699-34.697zM213.053 100.678H44.867c-19.128 0-34.697 15.569-34.697 34.697v318.558c0 19.136 15.569 34.697 34.697 34.697H213.053c19.122 0 34.691-15.561 34.691-34.697V135.375c0-19.128-15.569-34.697-34.691-34.697zM44.867 135.232l168.314.143-.072 283.972H44.748l.119-284.115zm65.766 317.785c0-10.113 8.202-18.316 18.308-18.316 10.146 0 18.349 8.202 18.349 18.316 0 10.122-8.202 18.341-18.349 18.341-10.106-.001-18.308-8.219-18.308-18.341zM361.752 128.511h-23.054a4.121 4.121 0 00-3.815 2.558 4.129 4.129 0 00.899 4.483l40.448 40.455a4.145 4.145 0 005.837 0l40.448-40.455a4.14 4.14 0 00.9-4.483 4.116 4.116 0 00-3.815-2.558h-23.293C395.001 57.443 336.873 0 265.503 0c-9.541 0-17.273 7.732-17.273 17.273 0 9.55 7.732 17.29 17.273 17.29 52.322 0 94.951 41.929 96.249 93.948z" />
            </g>
          </svg>
        </div>
      </div>
      <div className={s.page}>
        <Sidebar />
        <div className={s.content}>
          <Board />
        </div>
      </div>
    </>
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
