import React from 'react'
import cx from 'classnames'

import s from './Row.scss'


export type RowProps = {
  id?: string
  className?: string
  wrap?: boolean
  align?: 'center' | 'start' | 'end' | 'baseline' | 'stretch'
  justify?: 'between' | 'center' | 'start' | 'end'
  direction?: 'normal' | 'column'
}

const Row: React.FunctionComponent<RowProps> = (props) => {
  const {
    children, id, className,
    align = 'center', justify = 'between', direction = 'normal', wrap,
  } = props

  return (
    <div
      id={id}
      className={cx(s.row, className, {
        [s.wrap]: wrap,
        [s[`align-${align}`]]: Boolean(align),
        [s[`justify-${justify}`]]: Boolean(justify),
        [s[`direction-${direction}`]]: Boolean(direction),
      })}
    >
      {children}
    </div>
  )
}


export default Row
