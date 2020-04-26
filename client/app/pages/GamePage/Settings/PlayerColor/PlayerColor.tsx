import React, { useState, useCallback } from 'react'
import { useGameState } from 'game'
import cookie from 'js-cookie'
import socket from 'socket'
import cx from 'classnames'

import { Row, Box, Text } from 'components'

import s from './PlayerColor.scss'


const colors = [ 'red', 'blue' ]

const PlayerColor = () => {
  const { me: { color: initialColor } } = useGameState()
  const [ selectedColor, setColor ] = useState(initialColor)

  const handleClick = useCallback((color) => {
    setColor(color)
    cookie.set('color', color)
    socket.emit('change player color', color)
  }, [])

  return (
    <Row className={s.root} justify="center">
      <Text size="16-20">My team color is</Text>
      {
        colors.map((color) => {
          const className = cx(s.color, s[color], {
            [s.active]: color === selectedColor,
          })

          return (
            <Box key={color} ml={8}>
              <div className={className} onClick={() => handleClick(color)}>
                <Text size="16-20">{color}</Text>
              </div>
            </Box>
          )
        })
      }
    </Row>
  )
}


export default React.memo(PlayerColor)
