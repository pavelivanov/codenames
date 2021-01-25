import js from './js'
import css from './css'
import scss from './scss'
import images from './images'
import fonts from './fonts'


const rulesCreators = [ js, css, scss, images, fonts ]

const client = rulesCreators.reduce((res, rule) => res.concat(rule({ isClient: true })), [])
const server = rulesCreators.reduce((res, rule) => res.concat(rule({ isClient: false })), [])


export default {
  client,
  server,
}
