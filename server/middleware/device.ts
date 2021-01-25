import useragent from 'express-useragent'
import logger from 'logger'


const device: Server.Middleware = (req, res, next) => {
  const source = req.headers['user-agent']
  const { os, platform, browser, version, isMobile, isTablet, isDesktop, isBot } = useragent.parse(source)

  // ATTN for dev purpose only
  const forcedBot = /bot/.test(req.url)

  req.state.device = {
    os,
    platform,
    browser,
    version,
    isMobile,
    isTablet,
    isDesktop,
    isBot: forcedBot || isBot,
  }

  logger.info(`is bot: ${isBot}`)

  return next()
}


export default device
