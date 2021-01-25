const assets: Server.Middleware = (req, res, next) => {
  const { scripts, styles } = req.state.loadableTags

  req.state.assets = {
    scripts: req.state.device.isBot ? '' : scripts,
    styles,
  }

  next()
}


export default assets
