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
    <div className={s.content}>
      {
        teamPlayers.map(({ name }) => (
          <div key={name} className={s.player}>{name}</div>
        ))
      }
    </div>
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
