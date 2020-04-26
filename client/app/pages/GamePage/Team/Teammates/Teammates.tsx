import React from 'react'
import cx from 'classnames'

import { Text } from 'components'

import eyeIcon from './images/eye.svg'

import s from './Teammates.scss'


type TeammatesProps = {
  teamColor: TeamColor
  players: Player[]
}

const Teammates: React.FunctionComponent<TeammatesProps> = ({ teamColor, players }) => (
  <div>
    {
      players.map(({ playername, mode }) => {
        const spymaster = mode === 'spymaster'

        const className = cx(s.teammate, {
          [s.redTeam]: teamColor === 'red',
          [s.spymaster]: spymaster,
        })

        return (
          <div key={playername} className={className} title={mode}>
            <Text size="16-24" light>{playername}</Text>
            <img className={s.spyIcon} src={eyeIcon} alt="" />
          </div>
        )
      })
    }
  </div>
)


export default Teammates
