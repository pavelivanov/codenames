import React, { useRef, useEffect, useCallback } from 'react'
import { storage } from '@/helpers'
import cx from 'classnames'

import s from './ThemeToggle.module.scss'


type ThemeToggleProps = {
  className?: string
  size: 'small' | 'big'
}

const ThemeToggle: React.FunctionComponent<ThemeToggleProps> = ({ className, size }) => {
  const themeRef = useRef<string>(storage.getItem('codenames-theme') || 'light')

  useEffect(() => {
    document.body.classList.remove('theme-light')
    document.body.classList.remove('theme-dark')
    document.body.classList.add(`theme-${themeRef.current}`)
  }, [])

  const handleClick = useCallback(() => {
    themeRef.current = themeRef.current === 'light' ? 'dark' : 'light'

    storage.setItem('codenames-theme', themeRef.current)

    document.body.classList.remove('theme-light')
    document.body.classList.remove('theme-dark')
    document.body.classList.add(`theme-${themeRef.current}`)
  }, [])

  return (
    <div className={cx(s.switch, s[size], className)} onClick={handleClick}>
      <div className={s.handle} />
    </div>
  )
}


export default ThemeToggle
