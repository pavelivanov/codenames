import React, { useRef, useEffect, useCallback } from 'react'

import s from './Notification.module.scss'


export type NotificationProps = {
  closeNotification?: () => void
  onClick?: () => void
}

const Notification: React.FunctionComponent<NotificationProps> = (props) => {
  const { children, closeNotification, onClick } = props

  const nodeRef = useRef<HTMLDivElement>()

  const handleClose = useCallback(() => {
    nodeRef.current.style.marginTop = `${-1 * nodeRef.current.clientHeight}px`
    nodeRef.current.classList.add(s.closed)
    setTimeout(closeNotification, 300)
  }, [ closeNotification ])

  useEffect(() => {
    const timer = setTimeout(handleClose, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [ handleClose ])

  const handleClick = useCallback(() => {
    if (typeof onClick === 'function') {
      onClick()
    }
    else {
      handleClose()
    }
  }, [ handleClose, onClick ])

  return (
    <div ref={nodeRef} className={s.notification} onClick={handleClick}>
      {children}
    </div>
  )
}


export default Notification
