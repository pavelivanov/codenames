import React, { useContext } from 'react'
import { GameProvider, GameStateProvider, GameContext, GameStateContext } from '@/helpers/providers'

import Board from './Board/Board'
import Teams from './Teams/Teams'

import s from './GamePage.module.scss'


const Content = () => {
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

const GamePage = () => (
  <GameProvider>
    <GameStateProvider>
      <Content />
    </GameStateProvider>
  </GameProvider>
)


export default GamePage

export async function getServerSideProps(context) {
  context.res.statusCode = 404

  return {
    props: {},
    notFound: true,
  }
}
