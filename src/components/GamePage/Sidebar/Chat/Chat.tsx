import React, { useContext } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'

import s from './Chat.module.scss'


const Messages = () => {
  const { cards, colors } = useContext(GameContext)
  const { revealedCards } = useContext(GameStateContext)

  return (
    <div className={s.content}>
      {
        revealedCards.map(({ index, playerName }) => (
          <div key={index} className={s.message}>
            <b>{playerName}</b> revealed <span className={s[colors[index]]}>{cards[index]}</span>
          </div>
        ))
      }
    </div>
  )
}

const Basement = () => {

  return (
    <div className={s.basement}>
      <svg className={s.icon} height="512" width="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M400 24a24 24 0 00-24 24v272a32 32 0 01-32 32H169.941l47.03-47.029a24 24 0 00-33.942-33.942l-88 88a24 24 0 000 33.942l88 88a24 24 0 0033.942-33.942L169.941 400H344a80 80 0 0080-80V48a24 24 0 00-24-24z" />
      </svg>
      <form onSubmit={() => {}}>
        <input className={s.input} placeholder="Message..." />
      </form>
    </div>
  )
}

const Chat = () => (
  <div className={s.chat}>
    <Messages />
    <Basement />
  </div>
)


export default Chat
