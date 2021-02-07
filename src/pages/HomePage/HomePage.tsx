import React, { useRef, useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'
import { request } from '@/helpers'
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
  }, [ cols, rows ])

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
          <Size cols={5} rows={4} onChange={handleChange} onClick={handleSubmit} />
          <Size cols={6} rows={4} onChange={handleChange} onClick={handleSubmit} />
          <Size cols={6} rows={5} onChange={handleChange} onClick={handleSubmit} />
        </div>
      </div>
      <div className={s.board}>
        {
          new Array(30).fill(0).map((_, index) => {
            const num = index + 1
            const maxWidth = 6

            const isActive = sizes && (
              ((num % maxWidth > 0 && num % maxWidth < sizes.cols + 1) || sizes.cols === maxWidth)
              && num <= maxWidth * sizes.rows
            )

            return (
              <div key={index} className={cx(s.cell, { [s.active]: isActive })} />
            )
          })
        }
      </div>
    </div>
  )
}

const HomePage = () => {
  const [ dark, setDark ] = useState(false)
  const ref2 = useRef<HTMLDivElement>()
  const ref = useRef<boolean>(true)

  const handleChange = useCallback(() => {
    setDark((v) => !v)
    ref.current = false
  }, [])

  const darkContainerClassName = cx(s.darkContainer, {
    [s.noAnimate]: ref.current,
    [s.active]: dark,
  })

  return (
    <div className={s.root}>
      <div className={cx(s.themeButton, { [s.active]: dark })} onClick={handleChange} />
      <div ref={ref2} className={darkContainerClassName}>
        <Content />
      </div>
      <Content />
    </div>
  )
}


export default HomePage
