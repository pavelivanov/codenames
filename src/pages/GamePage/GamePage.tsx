import React, { useContext, useRef, useState, useCallback, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { GameProvider, GameStateProvider, GameContext, GameStateContext } from '@/helpers/providers'
import { storage } from '@/helpers'
import { useRouter } from 'next/router'

import Board from '@/components/GamePage/Board/Board'
import Team from '@/components/GamePage/Team/Team'
// import Chat from '@/components/GamePage/Chat/Chat'

import s from './GamePage.module.scss'


const CopyButton = React.memo(() => {
  const router = useRouter() // for reload
  const [ copied, setCopied ] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 700)
    }
  }, [ copied ])

  return (
    <CopyToClipboard text={window.location.href} onCopy={() => setCopied(true)}>
      <div className={s.copyButton}>
        {
          !copied ? (
            <svg width="512" height="512" viewBox="-40 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="m271 512h-191c-44.113281 0-80-35.886719-80-80v-271c0-44.113281 35.886719-80 80-80h191c44.113281 0 80 35.886719 80 80v271c0 44.113281-35.886719 80-80 80zm-191-391c-22.054688 0-40 17.945312-40 40v271c0 22.054688 17.945312 40 40 40h191c22.054688 0 40-17.945312 40-40v-271c0-22.054688-17.945312-40-40-40zm351 261v-302c0-44.113281-35.886719-80-80-80h-222c-11.046875 0-20 8.953125-20 20s8.953125 20 20 20h222c22.054688 0 40 17.945312 40 40v302c0 11.046875 8.953125 20 20 20s20-8.953125 20-20zm0 0" />
            </svg>
          ) : (
            <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M504.502 75.496c-9.997-9.998-26.205-9.998-36.204 0L161.594 382.203 43.702 264.311c-9.997-9.998-26.205-9.997-36.204 0-9.998 9.997-9.998 26.205 0 36.203l135.994 135.992c9.994 9.997 26.214 9.99 36.204 0L504.502 111.7c9.998-9.997 9.997-26.206 0-36.204z" />
            </svg>
          )
        }
      </div>
    </CopyToClipboard>
  )
})

const Content = ({ onThemeChange }) => {
  const game = useContext(GameContext)
  const state = useContext(GameStateContext)

  if (!game || !state) {
    return null
  }

  return (
    <div className={s.page}>
      <div className={s.sidebar}>
        <div className={s.header}>
          <div className={s.title}>CodeNames</div>
          <div className={s.themeButton} onClick={onThemeChange} />
          <CopyButton />
        </div>
        <div className={s.section}>
          <Team color="red" />
        </div>
        <div className={s.section}>
          <Team color="blue" />
        </div>
        <div className={s.section}>
          {/*<Chat />*/}
        </div>
      </div>
      <div className={s.content}>
        <Board />
      </div>
    </div>
  )
}

const GamePage = () => {
  const themeRef = useRef<string>(storage.getItem('codenames-theme') || 'light')

  useEffect(() => {
    document.body.classList.remove('theme-light')
    document.body.classList.remove('theme-dark')
    document.body.classList.add(`theme-${themeRef.current}`)
  }, [])

  const handleThemeChange = useCallback(() => {
    themeRef.current = themeRef.current === 'light' ? 'dark' : 'light'

    storage.setItem('codenames-theme', themeRef.current)

    document.body.classList.remove('theme-light')
    document.body.classList.remove('theme-dark')
    document.body.classList.add(`theme-${themeRef.current}`)
  }, [])

  return (
    <GameProvider>
      <GameStateProvider>
        <Content onThemeChange={handleThemeChange} />
      </GameStateProvider>
    </GameProvider>
  )
}


export default GamePage

export async function getServerSideProps(context) {
  context.res.statusCode = 404

  return {
    props: {},
    notFound: true,
  }
}
