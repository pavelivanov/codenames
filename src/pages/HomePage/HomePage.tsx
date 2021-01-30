import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import cx from 'classnames'
import Image from 'next/image'
import { request } from '@/helpers'

import s from './HomePage.module.scss'


const Board = ({ width, height }) => {
  const router = useRouter()

  const handleClick = useCallback(() => {
    request.post('/game', {
      cols: 5,
      rows: 5,
      lang: 'ru',
    })
      .then(({ data }) => {
        console.log(999, data)

        router.push(`/game/${data.id}`)
      })
      .catch(() => {

      })
  }, [ width, height ])

  return (
    <div className={s.board} onClick={handleClick}>
      {
        new Array(30).fill(0).map((_, index) => {
          const num = index + 1
          const maxWidth = 6

          const isActive = (
            ((num % maxWidth > 0 && num % maxWidth < width + 1) || width === maxWidth)
            && num <= maxWidth * height
          )

          return (
            <div key={index} className={cx(s.cell, { [s.active]: isActive })} />
          )
        })
      }
    </div>
  )
}

const HomePage = () => {

  return (
    <div className={s.page}>
      <div className={s.headline}>
        <div className={s.logo}>CODENAMES</div>
        <div className={s.subLogo}>Play with your friends</div>
      </div>
      <button className={s.themeButton}>
        <Image src="/sun.svg" layout="fill" alt="" />
      </button>
      <div className={s.title}>Select board size</div>
      <div className={s.boards}>
        <Board width={5} height={4} />
        <Board width={6} height={4} />
        <Board width={6} height={5} />
      </div>
    </div>
  )
}


export default HomePage
