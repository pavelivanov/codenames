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
      players.map(({ name, mode }) => {
        const spymaster = mode === 'spymaster'

        const className = cx(s.teammateContainer, {
          [s.redTeam]: teamColor === 'red',
          [s.spymaster]: spymaster,
        })

        return (
          <div key={name} className={className} title={mode}>
            <span className={s.teammate} title={mode}>
              <Text size="16-24" tag="span">{name}</Text>
              <img className={s.spyIcon} src={eyeIcon} alt="" />
            </span>
          </div>
        )
      })
    }
  </div>
)


export default Teammates
