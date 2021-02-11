import React, { useRef, useState, useCallback, useEffect } from 'react'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { request, storage } from '@/helpers'
import { useRouter } from 'next/router'
import cx from 'classnames'

import s from './HomePage.module.scss'


const Lang = ({ lang, active, onClick }) => (
  <div
    className={cx(s.lang, { [s.active]: active })}
    onClick={onClick}
  >
    {lang}
  </div>
)

const Size = ({ cols, rows, onChange, onClick }) => {
  const handleMouseEnter = useCallback(() => {
    onChange({ cols, rows })
  }, [])

  const handleMouseLeave = useCallback(() => {
    onChange(null)
  }, [])

  const handleClick = useCallback(() => {
    onClick({ cols, rows })
  }, [ cols, rows, onClick ])

  return (
    <div
      className={s.size}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {cols} <span>&times;</span> {rows}
    </div>
  )
}

const Content = () => {
  const router = useRouter()
  const [ lang, setLang ] = useState('en')
  const [ sizes, setSizes ] = useState(null)

  const handleChange = useCallback((sizes) => {
    setSizes(sizes)
  }, [])

  const handleSubmit = useCallback(({ cols, rows }) => {
    request.post('/game', { cols, rows, lang })
      .then(({ data }) => {
        router.push(`/game/${data.id}`)
      })
      .catch(() => {

      })
  }, [ lang ])

  return (
    <div className={s.page}>
      <div className={s.title}>
        Play<br />
        <span>CodeNames</span><br />
        online<br />
        across<br />
        multiple<br />
        devices on<br />
        a shared<br />
        board.<br />
      </div>
      <div className={s.content}>
        <Lang lang="Russian" active={lang === 'ru'} onClick={() => setLang('ru')} />
        <Lang lang="English" active={lang === 'en'} onClick={() => setLang('en')} />
        <div className={s.sizes}>
          <Size cols={4} rows={5} onChange={handleChange} onClick={handleSubmit} />
          <Size cols={5} rows={5} onChange={handleChange} onClick={handleSubmit} />
          <Size cols={5} rows={6} onChange={handleChange} onClick={handleSubmit} />
        </div>
      </div>
      <div className={s.board}>
        {
          new Array(30).fill(0).map((_, index) => {
            const num = index + 1
            const maxWidth = 5

            const isActive = sizes && (
              ((num % maxWidth > 0 && num % maxWidth < sizes.cols + 1) || sizes.cols === maxWidth)
              && num <= maxWidth * sizes.rows
            )

            return (
              <div key={index} className={cx(s.card, { [s.active]: isActive })} />
            )
          })
        }
      </div>
    </div>
  )
}

const HomePage = () => {
  const [ _, setState ] = useState<any>()
  const animateRef = useRef<boolean>(true)
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

    setState({})
    animateRef.current = false
  }, [])

  const darkRootClassName = cx(s.root, s.dark, {
    [s.noAnimate]: animateRef.current,
  })

  return (
    <>
      <ThemeToggle className={s.themeButton} onToggle={handleThemeChange} />
      <div className={cx(s.root, s.light)}>
        <Content />
      </div>
      <div className={darkRootClassName}>
        <Content />
      </div>
    </>
  )
}


export default HomePage
