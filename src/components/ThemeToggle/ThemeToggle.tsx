import React, { useRef, useEffect, useCallback } from 'react'
import { storage } from '@/helpers'
import cx from 'classnames'

import s from './ThemeToggle.module.scss'


type ThemeToggleProps = {
  className?: string
  onToggle?: () => void
}

const ThemeToggle: React.FunctionComponent<ThemeToggleProps> = ({ className, onToggle }) => {
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

    if (typeof onToggle === 'function') {
      onToggle()
    }
  }, [])

  return (
    <div className={cx(s.toggle, className)} onClick={handleClick}>
      <div />
    </div>
  )
}


export default ThemeToggle
