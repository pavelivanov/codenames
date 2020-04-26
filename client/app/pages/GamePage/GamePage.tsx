import React, { Fragment, useState, useMemo, useEffect } from 'react'
import { useGameState } from 'game'
import socket from 'socket'

import gameConnection from 'decorators/gameConnection'

import { Row } from 'components'

import Settings from './Settings/Settings'
import Team from './Team/Team'
import Field from './Field/Field'

import s from './GamePage.scss'


const GamePage = () => {
  const { me, players: initialPlayers } = useGameState()
  const [ players, setPlayers ] = useState(initialPlayers)

  useEffect(() => {
    socket.on('player joined game', (player) => {
      setPlayers((players) => [
        ...players,
        player,
      ])
    })

    socket.on('player left game', (playername) => {
      setPlayers((players) => (
        players.filter((player) => player.playername !== playername)
      ))
    })

    const handlePlayerChangeColor = ({ playername, color }) => {
      setPlayers((players) => (
        players.map((player) => {
          if (player.playername === playername) {
            return {
              ...player,
              color,
            }
          }

          return player
        })
      ))
    }

    socket.on('color changed', (color) => handlePlayerChangeColor({ playername: me.playername, color }))
    socket.on('player changed color', handlePlayerChangeColor)

    const handlePlayerChangeMode = ({ playername, mode }) => {
      setPlayers((players) => (
        players.map((player) => {
          if (player.playername === playername) {
            return {
              ...player,
              mode,
            }
          }

          return player
        })
      ))
    }

    socket.on('mode changed', (mode) => handlePlayerChangeMode({ playername: me.playername, mode }))
    socket.on('player changed mode', handlePlayerChangeMode)
  }, [])

  const redTeam = useMemo(() => (
    players.filter((player) => player.color === 'red')
  ), [ players ])

  const blueTeam = useMemo(() => (
    players.filter((player) => player.color === 'blue')
  ), [ players ])

  return (
    <Fragment>
      <div className={s.logo}>CODENAMES</div>
      <div className={s.content}>
        <Row align="start">
          <Team color="red" players={redTeam} />
          <Field />
          <Team color="blue" players={blueTeam} />
        </Row>
      </div>
      <Settings />
    </Fragment>
  )
}


export default gameConnection(GamePage)
