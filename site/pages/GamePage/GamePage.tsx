import React, { useMemo } from 'react'
import { useGameState } from 'game'

import { Row } from 'components'

import ConnectionWrapper from './ConnectionWrapper/ConnectionWrapper'
import GameLink from './GameLink/GameLink'
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
    <div className={s.page}>
      <div className={s.headline}>
        <h1 className={s.logo}>
          <a href="//codenames.wtf">CODENAMES</a>
        </h1>
        {/*<GameLink />*/}
      </div>
      <div className={s.content}>
        <Row align="start">
          <div className={s.column}>
            <RedTeam />
          </div>
          <Field />
          <div className={s.column}>
            <BlueTeam />
          </div>
        </Row>
      </div>
      <div className={s.basement}>
        <a className={s.buyACoffeeLink} href="https://www.buymeacoffee.com/pavelivanov" target="_blank">buy the developer a coffee</a>
        <Settings />
      </div>
    </div>
  </ConnectionWrapper>
)


export default GamePage
