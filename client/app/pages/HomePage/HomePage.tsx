import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import socket from 'socket'

import Setting from './Setting/Setting'

import s from './HomePage.scss'


const languages = [ 'English', 'Russian' ]
const fieldSizes = [ /* '6x6', */ '6x5', '5x5', '5x4' ]
const timerValues = [ 'On', 'Off' ]

const HomePage = () => {
  const history = useHistory()
  const [ language, setLanguage ] = useState('English')
  const [ fieldSize, setFieldSize ] = useState('5x5')

  useEffect(() => {
    const handleGameCreate = ({ gameId }) => {
      history.push(`/board/${gameId}`)
    }

    socket.on('game created', handleGameCreate)

    return () => {
      socket.off('game created', handleGameCreate)
    }
  }, [])

  const handleSelectFieldSize = useCallback((fieldSize) => {
    setFieldSize(fieldSize)
  }, [])

  const handleSelectLang = useCallback((language) => {
    setLanguage(language)
  }, [])

  const handleSubmit = useCallback(() => {
    socket.emit('create game', { fieldSize, language })
  }, [ fieldSize, language ])

  const settings = useMemo(() => ([
    {
      label: 'Language',
      values: languages,
      activeValue: language,
      onSelect: handleSelectLang,
    },
    {
      label: 'Field size',
      values: fieldSizes,
      activeValue: fieldSize,
      onSelect: handleSelectFieldSize,
    },
    // {
    //   label: 'Timer',
    //   values: timerValues,
    //   activeValue: 'Off',
    //   dev: true,
    // },
  ]), [ fieldSize, language ])

  return (
    <div className={s.content}>
      <h1 className={s.logo}>
        <a href="//codenames.wtf">CODENAMES</a>
      </h1>
      <p className={s.intro}>Play Codenames online now! Call your friends over Zoom, Skype, Hangouts or Facetime and play!</p>
      <div className={s.settings}>
        <table>
          <tbody>
            {
              settings.map((setting, index) => (
                <Setting key={index} {...setting} />
              ))
            }
          </tbody>
        </table>
      </div>
      <button className={s.button} type="button" onClick={handleSubmit}>Create game</button>
      <a className={s.rules} href="https://en.wikipedia.org/wiki/Codenames_(board_game)" target="_blank">Game rules</a>
    </div>
  )
}


export default HomePage
