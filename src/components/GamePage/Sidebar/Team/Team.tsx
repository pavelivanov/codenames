import React, { useRef, useContext, useEffect, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket, storage } from '@/helpers'
import cx from 'classnames'

import Navigation from './Navigation/Navigation'

import s from './Team.module.scss'


const Headline = ({ color }) => {
  const { colors } = useContext(GameContext)
  const { revealedCards } = useContext(GameStateContext)

  const total = colors.filter((c) => c === color).length
  const revealedCount = revealedCards.map(({ index }) => colors[index]).filter((c) => c === color).length
  const count = total - revealedCount

  return (
    <div className={s.headline}>
      <div className={s.title}>{color} Team <span>/</span>&nbsp;</div>
      <div className={s.wordCount}>{count}</div>
    </div>
  )
}

const Players = ({ color }) => {
  const { players } = useContext(GameStateContext)

  const teamPlayers = players.filter((p) => p.color === color)

  return (
    <>
      <div className={s.content}>
        {
          teamPlayers.map(({ name, spymaster }) => (
            <div key={name} className={s.player}>
              <span>{name}</span>
              {
                spymaster && (
                  <svg>
                    <use href="#crown" />
                  </svg>
                )
              }
            </div>
          ))
        }
      </div>
      <svg className={s.hidden} xmlns="http://www.w3.org/2000/svg">
        <symbol id="crown" viewBox="0 0 512 512">
          <path fill="currentColor" d="M504.981 150.787a19.997 19.997 0 00-21.736-2.769l-109.444 53.28L271.109 82.896a19.998 19.998 0 00-30.218 0L138.199 201.297l-109.444-53.28a20.001 20.001 0 00-27.89 23.8l76 250A19.999 19.999 0 0096 436h320a19.998 19.998 0 0019.134-14.182l76-250a19.998 19.998 0 00-6.153-21.031zM401.175 396H110.823L52.472 204.052l82.022 39.931a20 20 0 0023.863-4.878L256 126.525l97.644 112.58a19.998 19.998 0 0023.862 4.878l82.022-39.931L401.175 396z" />
        </symbol>
      </svg>
    </>
  )
}

const JoinForm = ({ color }) => {
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    const name = storage.getItem('codenames-player-name')

    if (name) {
      inputRef.current.value = name
    }
  }, [])

  const handleSubmit = useCallback((event) => {
    event.preventDefault()

    const name = inputRef.current.value

    if (name) {
      storage.setItem('codenames-player-name', name)
      socket.emit('join team', { name, color })
    }
  }, [ color ])

  return (
    <form className={s.joinForm} onSubmit={handleSubmit}>
      <input ref={inputRef} className={s.joinInput} placeholder="Player name" />
      <button className={s.button} type="submit">Join team</button>
    </form>
  )
}

const Basement = ({ color }) => {
  const { player, players } = useContext(GameStateContext)

  const isPlayerJoinedATeam = Boolean(players.find((p) => p.id === player?.id))
  const isPlayerTeam = isPlayerJoinedATeam && player?.color === color

  return (
    <>
      {
        !isPlayerJoinedATeam && (
          <JoinForm color={color} />
        )
      }
      {
        isPlayerTeam && (
          <Navigation />
        )
      }
    </>
  )
}

const Team = ({ color }) => (
  <div className={cx(s.team, s[color])}>
    <Headline color={color} />
    <Players color={color} />
    <Basement color={color} />
  </div>
)


export default Team
