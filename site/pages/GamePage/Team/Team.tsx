import React from 'react'
import cx from 'classnames'

import { Box, Text } from 'components'

import TeamCardCount from './TeamCardCount/TeamCardCount'
import Teammates from './Teammates/Teammates'

import s from './Team.scss'


type TeamProps = {
  color: TeamColor
  players: Player[]
}

const Team: React.FunctionComponent<TeamProps> = ({ color, players }) => (
  <Box className={cx(s.team, s[color])} pt={20}>
    <Box mb={12}>
      <TeamCardCount teamColor={color} />
    </Box>
    <Box mb={24}>
      <Text className={s.title} size="14-24" uppercase noWrap>{color} Team</Text>
    </Box>
    <Teammates teamColor={color} players={players} />
  </Box>
)


export default React.memo(Team)
