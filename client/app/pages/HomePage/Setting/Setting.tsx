import React from 'react'
import cx from 'classnames'

import s from './Setting.scss'


type SettingProps = {
  label: string
  values: any[]
  activeValue: any
  onSelect: (value: any) => void
}

const Setting: React.FunctionComponent<SettingProps> = ({ label, values, activeValue, dev, onSelect }) => (
  <tr>
    <td className={s.cell}>
      <span className={s.labelContainer}>
        {
          dev && (
            <span className={s.dev}>Will be soon!</span>
          )
        }
        <span className={cx(s.label, { [s.disabled]: dev })}>{label}</span>
      </span>
    </td>
    <td className={s.cell}>
      <div className={s.values}>
        {
          values.map((value) => (
            <div 
              key={value}
              className={cx(s.value, { 
                [s.active]: value === activeValue,
                [s.disabled]: dev,
              })}
              onClick={() => onSelect(value)}
            >
              {value}
            </div>
          ))
        }
      </div>
    </td>
  </tr>
)


export default Setting