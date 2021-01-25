import * as Sentry from '@sentry/node'


// init server Sentry
if (process.env.SENTRY_SERVER_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_SERVER_DSN,
    environment: process.env.RUN_ENV || 'local',
    release: process.env.APP_VERSION,
  })
}
