import React, { useRef, useMemo, useEffect } from 'react'
import { useGameState } from 'game'
import cookie from 'js-cookie'
import cx from 'classnames'

import s from './Settings.scss'

import Setting from './Setting/Setting'


type SettingsProps = {
  color: TeamColor
  mode: PlayerMode
}

const SettingsWrapper = () => {
  const { me: { color, mode } } = useGameState()

  return (
    <Settings {...{ color, mode }} />
  )
}

const Settings: React.FunctionComponent<SettingsProps> = React.memo(({ color, mode }) => {
  const ref = useRef<HTMLDivElement>()

  useEffect(() => {
    if (cookie.get('themeColor') === 'dark') {
      document.body.classList.add('dark-theme')
    }
  }, [])

  const settings = useMemo<any[]>(() => [
    {
      label: 'theme',
      values: [ 'light', 'dark' ],
      initialValue: cookie.get('themeColor') || 'light',
      cookieName: 'themeColor',
      onClick: (value) => {
        if (value === 'dark') {
          document.body.classList.add('dark-theme')
        }
        else {
          document.body.classList.remove('dark-theme')
        }
      }
    },
    {
      label: 'my team color',
      values: [ 'red', 'blue' ],
      initialValue: color,
      name: 'color',
      cookieName: 'playerColor',
    },
    {
      label: 'I am a',
      values: [ 'player', 'spymaster' ],
      initialValue: mode,
      name: 'mode',
    },
  ], [])

  return (
    <div ref={ref} className={cx(s.settings, s.alwaysVisible)}>
      {
        settings.map((setting, index) => (
          <div key={index} className={s.item}>
            <Setting {...setting} />
          </div>
        ))
      }
    </div>
  )
})


export default SettingsWrapper
