import { cloneElement } from 'preact'
import { isValidElement } from 'preact/compat'
import { usePathname, useRouter } from './util/contexts'

import type { FunctionComponent } from 'preact'
import type { SwitchProps } from './types'


const Switch: FunctionComponent<SwitchProps> = ({ children, location }) => {
  const { matcher } = useRouter()
  const originalPathname = usePathname()

  const nodesToRender = []
  let match

  const matchRoutes = (children) => {
    // if wrapper has only one children
    if (!Array.isArray(children)) {
      children = [ children ]
    }

    for (const child of children) {
      if (!match && isValidElement(child)) {
        if (child.props.children) {
          // if node is Layout then add it to nodesToRender
          nodesToRender.push(child)

          // and iterate again
          matchRoutes(child.props.children)

          // if in nested routes no match then remove added Layout (move up by tree)
          if (!match) {
            nodesToRender.pop()
          }
        }
        else {
          const result = matcher(child.props.path, location || originalPathname)
          const matches = result[0] || child.props.path === '*'

          // if pathname match route path then add Route to nodesToRender
          if (matches) {
            match = result
            nodesToRender.push(child)
          }
        }
      }
    }
  }

  matchRoutes(children)

  if (match) {
    return nodesToRender.reverse().reduce((result, node) => {
      // render route
      if (!result) {
        return cloneElement(node, { match })
      }

      // render layout
      return cloneElement(node, { match }, result)
    }, null)
  }

  return null
}


export default Switch
