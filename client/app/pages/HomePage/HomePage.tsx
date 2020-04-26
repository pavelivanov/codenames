import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import socket from 'socket'

import Setting from './Setting/Setting'

import s from './HomePage.scss'


const languages = [ 'English', 'Russian' ]
const fieldSizes = [ /* '6x6', */ '6x5', '5x5', '5x4' ]

const HomePage = () => {
  const history = useHistory()
  const [ language, setLanguage ] = useState('English')
  const [ fieldSize, setFieldSize ] = useState('5x5')

  useEffect(() => {
    const handleGameCreate = ({ gameId }) => {
      history.push(`/game/${gameId}`)
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
  ]), [ fieldSize, language ])

  return (
    <div className={s.content}>
      <div className={s.logo}>CODENAMES</div>
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
    </div>
  )
}


export default HomePage
