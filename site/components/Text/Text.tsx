import React from 'react'
import cx from 'classnames'

import s from './Text.scss'


export const sizes = [
  '56-56',
  '48-56',
  '38-56',
  '38-48',
  '32-40',
  '28-40',
  '22-32',
  '20-24',
  '18-24',
  '16-24',
  '16-20',
  '14-24',
  '14-16',
  '12-24',
  '12-16',
] as const

export const colors = [
  'black',
  'gray',
] as const

export type Size = typeof sizes[number]
export type Color = typeof colors[number]

export type TextProps = {
  children: any
  className?: string
  message?: string
  tag?: string
  size?: Size
  align?: 'left' | 'center' | 'right'
  thin?: boolean
  light?: boolean
  semibold?: boolean
  bold?: boolean
  uppercase?: boolean
  capitalize?: boolean
  italic?: boolean
  muted?: boolean
  color?: Color
  letterSpacing?: boolean
  ellipsis?: boolean
  noWrap?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

const getWeight = ({ thin, light, semibold, bold }): string => {
  if (thin) return 'thin'
  if (light) return 'light'
  if (semibold) return 'semibold'
  if (bold) return 'bold'
  return 'normal'
}

const Text = React.forwardRef<HTMLElement, TextProps>((props, ref) => {
  const {
    children, className, tag = 'div', size = '16-24',
    muted, align, uppercase, capitalize, thin, light, semibold, bold,
    color, italic, letterSpacing, ellipsis, noWrap,
    onClick,
  } = props

  if (onClick && tag !== 'button') {
    console.error('You can\'t use "onClick" without passing tag === "button". Create components ADA friendly!')
  }

  if (size && !sizes.includes(size)) {
    console.error(`Wrong size "${size}" passed to Text component`)
  }

  const weight = getWeight({ thin, light, semibold, bold })

  const rootClassName = cx(className,  {
    [s[`size-${size}`]]: size,
    [s[`weight-${weight}`]]: weight,
    [s.uppercase]: uppercase,
    [s.capitalize]: capitalize,
    [s[`align-${align}`]]: align,
    [s.muted]: muted,
    [s[color]]: color,
    [s.italic]: italic,
    [s.letterSpacing]: letterSpacing,
    [s.ellipsis]: ellipsis,
    [s.noWrap]: noWrap,
  })

  return React.createElement(tag, {
    ref,
    className: rootClassName,
    onClick,
  }, children)
})


export default Text
