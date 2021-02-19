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

  const handleClick = useCallback(() => {
    socket.emit('become spymaster')
    storage.removeItem(game.id)
  }, [ game ])

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

  const teamPlayers = players.filter((p) => p.color === player?.color)

  const isSwitchVisible = Boolean(player && !player.spymaster)
  const isSpymasterVisible = Boolean(player && teamPlayers.filter((p) => p.spymaster).length === 0)
  const isSpectatorVisible = Boolean(player)

  return (
    <div className={s.navigation}>
      {
        isSwitchVisible && (
          <Switch />
        )
      }
      {
        isSpymasterVisible && (
          <Spymaster />
        )
      }
      {
        isSpectatorVisible && (
          <Spectator />
        )
      }
    </div>
  )
}


export default Navigation
