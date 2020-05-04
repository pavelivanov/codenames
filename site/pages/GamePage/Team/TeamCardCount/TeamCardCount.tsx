import React, { useState, useMemo, useEffect } from 'react'
import { useGameState } from 'game'
import socket from 'socket'
import cx from 'classnames'

import { Text } from 'components'

import s from './TeamCardCount.scss'


const getCount = (cards: string[], namesToColors: { [key: string]: CardColor }, teamColor: TeamColor): number => (
  cards.filter((name) => namesToColors[name] === teamColor).length
)

type TeamCardCountWrapperProps = {
  teamColor: TeamColor
}

type TeamCardCountProps = {
  teamColor: TeamColor
  count: number
}

const TeamCardCountWrapper: React.FunctionComponent<TeamCardCountWrapperProps> = ({ teamColor }) => {
  const { cards, revealedCards, colors } = useGameState()

  const count = useMemo(() => {
    const namesToColors = cards.reduce((obj, name) => {
      obj[name] = colors[cards.indexOf(name)]
      return obj
    }, {})

    const totalCount = getCount(cards, namesToColors, teamColor)
    const revealedCount = getCount(revealedCards, namesToColors, teamColor)

    return totalCount - revealedCount
  }, [])

  return (
    <TeamCardCount {...{ teamColor, count }} />
  )
}

const TeamCardCount: React.FunctionComponent<TeamCardCountProps> = (props) => {
  const { teamColor, count: initialCount } = props

  const [ count, setCount ] = useState<number>(initialCount)

  useEffect(() => {
    const handleCardReveal = ({ color }: { color: CardColor }) => {
      if (color === teamColor) {
        setCount((count) => --count)
      }
    }

    socket.on('card revealed', handleCardReveal)

    return () => {
      socket.off('card revealed', handleCardReveal)
    }
  }, [])

  return (
    <Text 
      className={cx(s.cardCount, s[teamColor])}
      size="48-56" 
      uppercase
    >
      {count}
    </Text>
  )
}


export default React.memo(TeamCardCountWrapper)
