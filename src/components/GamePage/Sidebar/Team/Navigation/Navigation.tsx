import React, { useContext, useCallback } from 'react'
import { GameContext, GameStateContext } from '@/helpers/providers'
import { socket, storage } from '@/helpers'
import cx from 'classnames'

import s from './Navigation.module.scss'


const Switch = () => {
  const handleClick = useCallback(() => {
    socket.emit('change team')
  }, [])

  return (
    <div className={s.row}>
      <button className={s.button} onClick={handleClick}>Switch team</button>
    </div>
  )
}

const Spymaster = () => {
  const game = useContext(GameContext)
  const { player, players } = useContext(GameStateContext)

  const teamPlayers = players.filter((p) => p.color === player?.color)
  const isVisible = player && teamPlayers.filter((p) => p.spymaster).length === 0

  const handleClick = useCallback(() => {
    socket.emit('become spymaster')
    storage.removeItem(game.id)
  }, [ game ])

  if (!isVisible) {
    return null
  }

  return (
    <div className={s.row}>
      <button className={s.button} onClick={handleClick}>Become spymaster</button>
    </div>
  )
}

const Spectator = () => {
  const handleClick = useCallback(() => {
    socket.emit('leave team')
  }, [])

  return (
    <div className={s.row}>
      <button className={cx(s.button, s.red)} onClick={handleClick}>Become spectator</button>
    </div>
  )
}

const Navigation = () => {
  const { player, players } = useContext(GameStateContext)

  const isPlayerJoinedATeam = Boolean(players.find((p) => p.id === player?.id))

  if (player?.spymaster || !isPlayerJoinedATeam) {
    return null
  }

  return (
    <div className={s.navigation}>
      <Switch />
      <Spymaster />
      <Spectator />
    </div>
  )
}


export default Navigation
