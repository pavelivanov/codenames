import React, { useState, useEffect } from 'react'

import Notification from './Notification/Notification'

import { subscribe, unsubscribe, closeNotification } from './manager'


type NotificationsProps = {
  className?: string
  style?: any // only for storybook
}

const Notifications: React.FunctionComponent<NotificationsProps> = (props) => {
  const { className, style } = props

  const [ notifications, setNotifications ] = useState([])

  useEffect(() => {
    const openHandler = (notification, notifications) => {
      setNotifications(notifications)
    }

    const closeHandler = (notification, notifications) => {
      setNotifications(notifications)
    }

    subscribe({
      open: openHandler,
      close: closeHandler
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <div className={className} style={style}>
      {
        notifications.map(({ id, text }) => (
          <Notification key={id} closeNotification={() => closeNotification(id)}>
            {text}
          </Notification>
        ))
      }
    </div>
  )
}


export default React.memo(Notifications)
