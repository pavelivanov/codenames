import React, { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { useRouter } from 'next/router'

import Team from './Team/Team'
import Chat from './Chat/Chat'

import s from './Sidebar.module.scss'


const CopyButton = React.memo(() => {
  useRouter() // required to get new "window.location.href" value on route update
  const [ copied, setCopied ] = useState(false)

  const value = typeof window !== 'undefined' ? window.location.href : null

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 700)
    }
  }, [ copied ])

  return (
    <CopyToClipboard text={value} onCopy={() => setCopied(true)}>
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

const Sidebar = () => (
  <div className={s.sidebar}>
    <div className={s.header}>
      <div className={s.title}>CodeNames</div>
      <ThemeToggle className={s.themeButton} size="small" />
      <CopyButton />
    </div>
    <div className={s.section}>
      <Team color="red" />
    </div>
    <div className={s.section}>
      <Team color="blue" />
    </div>
    <div className={s.section}>
      <Chat />
    </div>
  </div>
)


export default Sidebar
