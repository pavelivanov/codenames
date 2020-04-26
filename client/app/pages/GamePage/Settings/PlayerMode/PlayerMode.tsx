import React, { useState, useEffect, useCallback } from 'react'
import { useGameState } from 'game'
import cookie from 'js-cookie'
import socket from 'socket'
import cx from 'classnames'

import { Row, Box, Text } from 'components'

import s from './PlayerMode.scss'


const modes = [ 'player', 'spymaster' ]

const PlayerMode = () => {
  const { me: { mode: initialMode } } = useGameState()
  const [ selectedMode, setMode ] = useState(initialMode)

  // useEffect(() => {
  //   setMode(initialMode)
  // }, [ initialMode ])

  useEffect(() => {
    const handleGameEnd = () => {
      setMode('player')
    }

    socket.on('game ended', handleGameEnd)

    return () => {
      socket.off('game ended', handleGameEnd)
    }
  }, [])

  const handleClick = useCallback((mode) => {
    setMode(mode)
    cookie.set('mode', mode)
    socket.emit('change player mode', mode)
  }, [])

  return (
    <Row className={s.root} justify="center">
      <Text size="16-20">I am a</Text>
      {
        modes.map((mode) => {
          const className = cx(s.mode, {
            [s.active]: mode === selectedMode,
          })

          return (
            <Box key={mode} ml={8}>
              <div className={className} onClick={() => handleClick(mode)}>
                <Text size="16-20">{mode}</Text>
              </div>
            </Box>
          )
        })
      }
    </Row>
  )
}


export default React.memo(PlayerMode)
