import { h } from 'preact'
import renderToString from 'preact-render-to-string'

import replaceReactComponents, { getComponentProps, getComponentChildren, createComponent } from './replaceReactComponents'


const Icon = ({ children, name, filled }) => h('div', { 'data-name': name, 'data-filled': filled }, children || 'Icon')
const Link = ({ children, to }) => h('a', { className: 'link', href: to }, children)

describe('getComponentProps', () => {

  it('should return map of attributes to values', () => {
    const message = '<Button boolAttr1 valueAttr1="/queue" valueAttr2=" value " emptyAttr="" boolAttr2 boolAttr3="false">content</Button>'
    const expected = { valueAttr1: '/queue', valueAttr2: ' value ', emptyAttr: '', boolAttr1: true, boolAttr2: true, boolAttr3: false }

    expect(getComponentProps(message)).toStrictEqual(expected)
  })

})

describe('getComponentChildren', () => {

  it('should return component content', () => {
    const message = '<Button to="/queue" title="" fullWidth>Add to queue</Button>'
    const expected = 'Add to queue'

    expect(getComponentChildren(message)).toEqual(expected)
  })

})

describe('createComponent', () => {

  it('should return rendered Preact component #1', () => {
    const message = '<Icon />'
    const components = { Icon }
    const component = createComponent(message, components)

    expect(renderToString(component)).toEqual('<div>Icon</div>')
  })

  it('should return rendered Preact component #2', () => {
    const message = '<Icon name="star" />'
    const components = { Icon }
    const component = createComponent(message, components)

    expect(renderToString(component)).toEqual('<div data-name="star">Icon</div>')
  })

  it('should return rendered Preact component #3', () => {
    const message = '<Icon name="star" filled>Other Icon</Icon>'
    const components = { Icon }
    const component = createComponent(message, components)

    expect(renderToString(component)).toEqual('<div data-name="star" data-filled>Other Icon</div>')
  })

})

describe('replaceReactComponents', () => {

  it('should return array of strings and Preact components', () => {
    const message = 'Read our <Icon /> <Link to="/docs">docs</Link>'
    const components = { Icon, Link }
    let result = replaceReactComponents(message, components)

    result = (
      result
        .map((value) => {
          if (typeof value === 'string') {
            return value
          }

          return renderToString(value)
        })
        .join('')
    ) as any

    expect(result).toEqual('Read our <div>Icon</div> <a class="link" href="/docs">docs</a>')
  })

})
