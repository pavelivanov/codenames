import React, { Fragment, useState, useMemo, useEffect } from 'react'
import { useGameState } from 'game'
import socket from 'socket'

import { Row } from 'components'

import ConnectionWrapper from './ConnectionWrapper/ConnectionWrapper'
import Settings from './Settings/Settings'
import Team from './Team/Team'
import Field from './Field/Field'

import s from './GamePage.scss'


const GamePage = () => {
  const { me, players: initialPlayers } = useGameState()
  const [ players, setPlayers ] = useState(initialPlayers)

  useEffect(() => {
    setPlayers(initialPlayers)
  }, [ initialPlayers ])

  useEffect(() => {
    const handlePlayerJoinGame = (player) => {
      setPlayers((players) => [
        ...players,
        player,
      ])
    }

    const handlePlayerLeftGame = (playername) => {
      setPlayers((players) => (
        players.filter((player) => player.playername !== playername)
      ))
    }

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

    const handleSelfColorChange = (color) => handlePlayerChangeColor({ playername: me.playername, color })

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

    const handleSelfModeChange = (mode) => handlePlayerChangeMode({ playername: me.playername, mode })

    const handleGameEnd = () => {
      setPlayers((players) => (
        players.map((player) => ({
          ...player,
          mode: 'player',
        }))
      ))
    }

    socket.on('player joined game', handlePlayerJoinGame)
    socket.on('player left game', handlePlayerLeftGame)
    socket.on('color changed', handleSelfColorChange)
    socket.on('player changed color', handlePlayerChangeColor)
    socket.on('mode changed', handleSelfModeChange)
    socket.on('player changed mode', handlePlayerChangeMode)
    socket.on('game ended', handleGameEnd)

    return () => {
      socket.off('player joined game', handlePlayerJoinGame)
      socket.off('player left game', handlePlayerLeftGame)
      socket.off('color changed', handleSelfColorChange)
      socket.off('player changed color', handlePlayerChangeColor)
      socket.off('mode changed', handleSelfModeChange)
      socket.off('player changed mode', handlePlayerChangeMode)
      socket.off('game ended', handleGameEnd)
    }
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

const GamePageWrapper = () => (
  <ConnectionWrapper>
    <GamePage/>
  </ConnectionWrapper>
)


export default GamePageWrapper
