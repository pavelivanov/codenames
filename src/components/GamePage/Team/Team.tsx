import React, { useRef, useContext, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket } from '@/helpers'
import cx from 'classnames'

import s from './Team.module.scss'


const Spymaster = ({ player }) => {
  const handleClick = useCallback(() => {
    socket.emit('become spymaster')
  }, [ player ])

  return (
    <button onClick={handleClick}>
      become a spymaster
    </button>
  )
}

const Team = ({ color }) => {
  const { colors } = useContext(GameContext)
  const { player, players, revealedCards } = useContext(GameStateContext)

  const inputRef = useRef<HTMLInputElement>()

  const handleJoinSubmit = useCallback((event) => {
    event.preventDefault()

    const name = inputRef.current.value

    socket.emit('join team', { name, color })
  }, [ color ])

  const handleChangeTeam = () => {
    socket.emit('change team')
  }

  const handleLeaveClick = useCallback(() => {
    socket.emit('leave team')
  }, [ color ])

  const isPlayerJoinedATeam = Boolean(players.find((p) => p.id === player?.id))
  const teamPlayers = players.filter((p) => p.color === color)
  const count = colors.filter((c) => c === color).length - revealedCards.length
  const isJoinVisible = isPlayerJoinedATeam && player?.color !== color
  const isSpymasterVisible = player && teamPlayers.filter((p) => p.spymaster).length === 0

  return (
    <div className={cx(s.team, s[color])}>
      <div className={s.headline}>
        <div className={s.title}>{color} Team <span>/</span>&nbsp;</div>
        <div className={s.wordCount}>{count}</div>
      </div>
      <div className={s.content}>
        {
          teamPlayers.map(({ name }) => (
            <div key={name} className={s.player}>{name}</div>
          ))
        }
      </div>
      {
        isPlayerJoinedATeam ? (
          isJoinVisible ? (
            <div className={s.changeSection}>
              <button className={s.joinButton} onClick={handleChangeTeam}>Join team</button>
            </div>
          ) : (
            <div className={s.leaveSection}>
              <button className={s.joinButton} onClick={handleLeaveClick}>Leave team</button>
            </div>
          )
        ) : (
          <form className={s.joinSection} onSubmit={handleJoinSubmit}>
            <input ref={inputRef} className={s.joinInput} placeholder="Player name" />
            <button className={s.joinButton} type="submit">Join team</button>
          </form>
        )
      }
      {/*<div className={s.footer}>*/}
      {/*  <div className={s.inputContainer}>*/}
      {/*    <input className={s.input} type="text" />*/}
      {/*  </div>*/}
      {/*  <button className={s.button}>Join</button>*/}
      {/*</div>*/}
    </div>
  )
}


export default Team
