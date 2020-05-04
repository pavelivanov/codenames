import React, { useRef, useMemo, useEffect } from 'react'
import { useGameState } from 'game'
import cx from 'classnames'

import s from './Settings.scss'

import Setting from './Setting/Setting'


type SettingItems = [
  {
    label: string
    values: string[]
    initialValue: TeamColor
    name: string
  },
  {
    label: string
    values: string[]
    initialValue: PlayerMode
    name: string
  }
]

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

  // useEffect(() => {
  //   setTimeout(() => {
  //     ref.current.classList.remove(s.alwaysVisible)
  //   }, 5 * 1000)
  // }, [])

  const settings = useMemo<SettingItems>(() => [
    {
      label: 'my team color',
      values: [ 'red', 'blue' ],
      initialValue: color,
      name: 'color',
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
