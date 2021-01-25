import React, { Fragment } from 'react'

import useIntl from './useIntl'
import replaceReactComponents from './util/replaceReactComponents'


type MessageProps = {
  value: string | Intl.Message
  html?: boolean
}

const Message: React.FunctionComponent<MessageProps> = (props) => {
  const { value, html } = props

  const intl = useIntl()

  if (!value) {
    // TODO handle error - added on 10/13/20 by pavelivanov
    return null
  }

  if (typeof value === 'string') {
    if (html) {
      return React.createElement('span', {
        dangerouslySetInnerHTML: { __html: value },
      })
    }

    // TODO handle error - added on 10/13/20 by pavelivanov
    return <Fragment>{value}</Fragment>
  }

  const { values, components, ...message } = value

  const formattedMessage: string = intl.formatMessage(message, values)

  if (components) {
    const formattedMessageArr: any[] = replaceReactComponents(formattedMessage, components)

    const children = formattedMessageArr.map((messageItem, index) => {
      if (typeof messageItem === 'string' || html) {
        return <span key={index} dangerouslySetInnerHTML={{ __html: messageItem }} />
      }

      return <Fragment key={index}>{messageItem}</Fragment>
    })

    return <Fragment>{children}</Fragment>
  }

  if (html) {
    return React.createElement('span', {
      dangerouslySetInnerHTML: { __html: formattedMessage },
    })
  }

  return <Fragment>{formattedMessage}</Fragment>
}


export default Message
