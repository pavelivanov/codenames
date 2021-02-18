import React from 'react'
import { Notifications as NotificationsConductor } from '@/notifications'

import s from './Notifications.module.scss'


const Notifications = () => (
  <NotificationsConductor className={s.notifications} />
)


export default Notifications
