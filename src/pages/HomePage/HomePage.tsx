import React, { useState, useCallback } from 'react'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import { request } from '@/helpers'
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

const HomePage = () => {
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
      <div className={s.titleContainer}>
        <ThemeToggle className={s.themeButton} size="big" />
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
      </div>
      <div className={s.content}>
        <div className={s.settings}>
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
    </div>
  )
}


export default HomePage
