// This is a copy of site component

import React from 'react'
import cx from 'classnames'

import s from './Box.scss'


const allowedKeys   = [ 'm', 'mt', 'mr', 'mb', 'ml', 'p', 'pt', 'pr', 'pb', 'pl' ] as const
const allowedSizes  = [ '4', '8', '12', '16', '20', '24', '32', '36', '40', '48', '56', '60', '64', '72', '80', '96' ] as const
const allowedNumericSizes  = [ 4, 8, 12, 16, 20, 24, 32, 36, 40, 48, 56, 60, 64, 72, 80, 96 ] as const

type Key          = typeof allowedKeys[number]
type StringSize   = typeof allowedSizes[number]
type NumericSize  = typeof allowedNumericSizes[number]
export type Size  = StringSize | NumericSize
export type SizeProps    = { [ key in Key ]?: Size }

const getClasses = (keys: SizeProps): string[] => {
  const classes = []

  Object.keys(keys).forEach((key: Key) => {
    let value = keys[key]

    if (!value) {
      return
    }

    classes.push(s[`${key}_${value}`])
  })

  return classes
}

interface BoxProps {
  children?: React.ReactNode
  id?: string
  className?: string
  alignCenter?: boolean
  alignRight?: boolean
  alignLeft?: boolean
  center?: boolean
  inline?: boolean
  relative?: boolean
  lineHeight0?: boolean
  m?: Size
  mt?: Size
  mr?: Size
  mb?: Size
  ml?: Size
  p?: Size
  pt?: Size
  pr?: Size
  pb?: Size
  pl?: Size
  tag?: string
  noWrapper?: boolean
  role?: string
  ariaLabel?: string
  ariaLabelledBy?: string
  dataTestId?: string
}

const Box: React.FunctionComponent<BoxProps> = (props) => {
  const {
    children, id, className,
    alignCenter, alignRight, alignLeft,
    center, inline, relative, lineHeight0,
    tag = 'div', noWrapper, role, ariaLabelledBy, ariaLabel, dataTestId,
    ...keys
  } = props

  const rootClassName = cx(className, ...getClasses(keys), {
    [s.center]: center,
    [s.inline]: inline,
    [s.relative]: relative,
    [s.alignCenter]: alignCenter,
    [s.alignRight]: alignRight,
    [s.alignLeft]: alignLeft,
    [s.lineHeight0]: lineHeight0,
  })

  if (noWrapper && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: cx(children.props.className, rootClassName),
    })
  }

  return React.createElement(tag, {
    id,
    className: rootClassName,
    role,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'data-testid': dataTestId,
  }, children)
}


export default Box
