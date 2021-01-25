import 'preact/debug'
import React from 'react'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'
import { loadableReady } from '@loadable/component'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'intl'
import { DeviceProvider } from 'device'
import { HelmetProvider } from 'react-helmet-async'
import { Router } from 'router'

import App from 'containers/App/App'
import Routes from 'containers/Routes/Routes'
import ErrorBoundary from 'containers/ErrorBoundary/ErrorBoundary'


const Root = () => (
  <ErrorBoundary>
    <IntlProvider locale="en">
      <HelmetProvider>
        <DeviceProvider value={window.__DEVICE__}>
          <App>
            <Router>
              <Routes />
            </Router>
          </App>
        </DeviceProvider>
      </HelmetProvider>
    </IntlProvider>
  </ErrorBoundary>
)

Sentry.init({
  dsn: process.env.SENTRY_CLIENT_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
})

loadableReady().then(() => {
  ReactDOM.hydrate(<Root />, document.getElementById('root'))
})
