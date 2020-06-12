import React, { useState, useCallback } from 'react'
import cookie from 'js-cookie'
import socket from 'socket'
import cx from 'classnames'

import { Row, Box, Text } from 'components'

import s from './Setting.scss'


const Setting = ({ label, values, initialValue, name, cookieName, onClick }) => {
  const [ selectedValue, setValue ] = useState(initialValue)

  const handleClick = useCallback((value) => {
    setValue(value)

    if (cookieName) {
      cookie.set(cookieName, value)
    }

    if (name) {
      socket.emit(`change player ${name}`, value)
    }

    if (typeof onClick === 'function') {
      onClick(value)
    }
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
