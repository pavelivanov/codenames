import React, { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'
import { storage } from '@/helpers'
import cx from 'classnames'

import s from './ThemeToggle.module.scss'


type ThemeToggleProps = {
  className?: string
  size: 'small' | 'big'
}

const ThemeToggle: React.FunctionComponent<ThemeToggleProps> = ({ className, size }) => {
  const [ theme, setTheme ] = useState(storage.getItem('codenames-theme') || 'light')

  useEffect(() => {
    document.body.classList.remove('theme-light')
    document.body.classList.remove('theme-dark')
    document.body.classList.add(`theme-${theme}`)
  }, [])

  const handleClick = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light'

    setTheme(newTheme)
    storage.setItem('codenames-theme', newTheme)

    document.body.classList.remove('theme-light')
    document.body.classList.remove('theme-dark')
    document.body.classList.add(`theme-${newTheme}`)
  }, [ theme ])

  return (
    <div className={cx(s.switch, s[size], className)} onClick={handleClick}>
      <Head>
        <link rel="icon" type="image/svg+xml" href={`/static/favicon/favicon-${theme}.svg`} />
        <link rel="alternate icon" href={`/static/favicon/favicon-${theme}.ico`} />
        <link rel="mask-icon" href={`/static/favicon/favicon-${theme}.svg`} color={theme === 'dark' ? '#ff8a01' : '#ff8a01'} />
      </Head>
      <div className={s.handle} />
    </div>
  )
}


export default ThemeToggle
