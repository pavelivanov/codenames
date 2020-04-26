import React, { useState, useMemo, useEffect } from 'react'
import { useGameState } from 'game'
import socket from 'socket'
import cx from 'classnames'

import { Text } from 'components'

import s from './TeamCardCount.scss'


const getCount = (cards, namesToColors, teamColor) => (
  cards.filter((name) => namesToColors[name] === teamColor).length
)

type TeamCardCountProps = {
  teamColor: TeamColor
}

const TeamCardCount: React.FunctionComponent<TeamCardCountProps> = ({ teamColor }) => {
  const { cards, revealedCards, colors } = useGameState()

  const initialCount = useMemo(() => {
    const namesToColors = cards.reduce((obj, name) => {
      obj[name] = colors[cards.indexOf(name)]
      return obj
    }, {})

    const totalCount = getCount(cards, namesToColors, teamColor)
    const revealedCount = getCount(revealedCards, namesToColors, teamColor)

    return totalCount - revealedCount
  }, [])

  const [ count, setCount ] = useState<number>(initialCount)

  useEffect(() => {
    socket.on('card revealed', ({ color }) => {
      if (color === teamColor) {
        setCount((count) => --count)
      }
    })
  }, [])

  return (
    <Text className={cx(s.cardCount, s[teamColor])} size="48-56" uppercase>{count}</Text>
  )
}


export default TeamCardCount
