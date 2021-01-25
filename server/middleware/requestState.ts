const requestState: Server.Middleware = (req, res, next) => {
  req.state = {
    device: null,
    appHtml: null,
    redirectUrl: null,
    helmet: null,
    assets: null,
  }

  return next()
}


export default requestState
