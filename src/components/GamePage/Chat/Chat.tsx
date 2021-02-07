import React from 'react'

import s from './Chat.module.scss'


const Chat = () => (
  <div className={s.chat}>
    <div className={s.content}>
      <div className={s.message}><b>Jenny</b> revealed <b>heart</b> card.</div>
      <div className={s.message}><b>Jenny Fesenko</b> revealed <b>heart</b> card.</div>
      <div className={s.message}><b>Jenny</b> revealed <b>heart</b> card.</div>
    </div>
    <div className={s.basement}>
      <svg className={s.icon} height="512" width="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path fill="currentColor" d="M400 24a24 24 0 00-24 24v272a32 32 0 01-32 32H169.941l47.03-47.029a24 24 0 00-33.942-33.942l-88 88a24 24 0 000 33.942l88 88a24 24 0 0033.942-33.942L169.941 400H344a80 80 0 0080-80V48a24 24 0 00-24-24z" />
      </svg>
      <form onSubmit={() => {}}>
        <input className={s.input} placeholder="Message..." />
      </form>
    </div>
  </div>
)


export default Chat
