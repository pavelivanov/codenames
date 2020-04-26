import React, { useMemo } from 'react'
import { useGameState } from 'game'

import { Row } from 'components'

import ConnectionWrapper from './ConnectionWrapper/ConnectionWrapper'
import Settings from './Settings/Settings'
import Team from './Team/Team'
import Field from './Field/Field'

import s from './GamePage.scss'


const RedTeam = React.memo(() => {
  const { players } = useGameState()

  const team = useMemo(() => (
    players.filter((player) => player.color === 'red')
  ), [ players ])

  return (
    <Team color="red" players={team} />
  )
})

const BlueTeam = React.memo(() => {
  const { players } = useGameState()

  const team = useMemo(() => (
    players.filter((player) => player.color === 'blue')
  ), [ players ])

  return (
    <Team color="blue" players={team} />
  )
})

const GamePage = () => (
  <ConnectionWrapper>
    <div className={s.logo}>CODENAMES</div>
    <div className={s.content}>
      <Row align="start">
        <RedTeam />
        <Field />
        <BlueTeam />
      </Row>
    </div>
    <Settings />
  </ConnectionWrapper>
)


export default GamePage
