import React from 'react'
import path from 'path'
import { IntlProvider } from 'intl'
import render from 'preact-render-to-string'
import { ChunkExtractorManager, ChunkExtractor } from '@loadable/server'
import { RouterContext, Router, createHistory, createLocationHook } from 'router/server'
import { FilledContext, HelmetProvider } from 'react-helmet-async'
import { DeviceProvider } from 'device'

import App from 'containers/App/App'
import Routes from 'containers/Routes/Routes'


const loadableStatsFile = path.resolve('build/client/loadableStats.json')

const appHtml: Server.Middleware = (req, res, next) => {
  const helmetContext = {} as FilledContext
  const routerContext = {} as RouterContext

  const history = createHistory(routerContext)
  const locationHook = createLocationHook(req.url)

  const loadableExtractor = new ChunkExtractor({
    statsFile: loadableStatsFile,
    publicPath: process.env.ASSETS_PATH,
    entrypoints: [ 'client' ],
  })

  req.state.appHtml = render(
    <ChunkExtractorManager extractor={loadableExtractor}>
      <IntlProvider locale="en">
        <HelmetProvider context={helmetContext}>
          <DeviceProvider value={req.state.device}>
            <App>
              <Router history={history} locationHook={locationHook}>
                <Routes />
              </Router>
            </App>
          </DeviceProvider>
        </HelmetProvider>
      </IntlProvider>
    </ChunkExtractorManager>
  )

  if (routerContext.url) {
    req.state.redirectUrl = routerContext.url
  }
  else {
    const scriptTags = loadableExtractor.getScriptTags()
    const styleTags = loadableExtractor.getStyleTags()

    req.state.helmet = helmetContext.helmet
    req.state.loadableTags = {
      scripts: scriptTags,
      styles: styleTags,
    }
  }

  next()
}


export default appHtml
