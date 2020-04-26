import React, { useRef, useCallback } from 'react'
import cookie from 'js-cookie'
import socket from 'socket'

import s from './Auth.scss'


const Auth = () => {
  const inputRef = useRef<HTMLInputElement>()

  const handleClick = useCallback(() => {
    const playername = inputRef.current.value

    cookie.set('playername', playername)
    socket.emit('login', playername)
  }, [])

  return (
    <div className={s.auth}>
      <div className={s.content}>
        <input className={s.input} ref={inputRef} type="text" placeholder="Player name" />
        <button className={s.button} type="button" onClick={handleClick}>Go</button>
        <div className={s.note}>The name will be stored for next games</div>
      </div>
    </div>
  )
}


export default Auth
