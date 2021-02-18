type OpenedNotification = { id: number, text: string }
type OpenedNotifications = OpenedNotification[]


let events = { open: null, close: null }
let notifications: OpenedNotifications = []
let notificationId = 1

const subscribe = ({ open, close }) => {
  events.open = open
  events.close = close
}

const unsubscribe = () => {
  events = null
}

const openNotification = <K extends keyof Notifications>(text: string) => {
  const notification = { id: ++notificationId, text }

  notifications = [ ...notifications, notification ]

  events.open(notification, notifications)
}

const closeNotification = (id: number): void => {
  const notification = notifications.find((notification) => notification.id === id)

  if (notification) {
    notifications = notifications.filter((notification) => notification.id !== id)
    events.close(notification, notifications)
  }
}

const closeAllNotifications = (): void => {
  notifications.forEach((notification) => {
    closeNotification(notification.id)
  })
}


export {
  subscribe,
  unsubscribe,
  openNotification,
  closeNotification,
  closeAllNotifications,
}
