import React, { useState, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import socket from 'socket'
import cx from 'classnames'

import s from './HomePage.scss'


const languages = [
  'English',
  'Russian',
]

const HomePage = () => {
  const history = useHistory()
  const [ lang, setLang ] = useState(languages[0])

  useEffect(() => {
    socket.on('game created', ({ gameId }) => {
      history.push(`/game/${gameId}`)
    })
  }, [])

  const handleSelectLang = useCallback((language) => {
    setLang(language)
  }, [])

  const handleClick = useCallback(() => {
    socket.emit('create game')
  }, [])

  return (
    <div className={s.page}>
      <div className={s.content}>
        <div className={s.logo}>CODENAMES</div>
        <div className={s.languages}>
          {
            languages.map((language) => (
              <div
                key={language}
                className={cx(s.language, {
                  [s.active]: language === lang,
                })}
                onClick={() => handleSelectLang(language)}
              >
                {language}
              </div>
            ))
          }
        </div>
        <button type="button" onClick={handleClick}>Create game</button>
      </div>
    </div>
  )
}


export default HomePage
