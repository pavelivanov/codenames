import React, { useState, useCallback } from 'react'
import cookie from 'js-cookie'
import socket from 'socket'
import cx from 'classnames'

import { Row, Box, Text } from 'components'

import s from './Setting.scss'


const Setting = ({ label, values, initialValue, name }) => {
  const [ selectedValue, setValue ] = useState(initialValue)

  const handleClick = useCallback((value) => {
    setValue(value)
    cookie.set(name, value)
    socket.emit(`change player ${name}`, value)
  }, [])

  return (
    <Row className={s.setting} justify="center">
      <Text size="16-24" light>{label}</Text>
      {
        values.map((value) => {
          const className = cx(s.value, {
            [s.active]: value === selectedValue,
          })

          return (
            <Box key={value} ml={8}>
              <div className={className} onClick={() => handleClick(value)}>
                <Text size="16-24">{value}</Text>
              </div>
            </Box>
          )
        })
      }
    </Row>
  )
}


export default React.memo(Setting)
