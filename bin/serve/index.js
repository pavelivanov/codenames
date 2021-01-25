const path = require('path')
const modPath = require('app-module-path')


modPath.addPath(path.join(process.cwd()))

require('module-alias').addAliases({
  'react': 'preact/compat',
  'react-dom': 'preact/compat',
})

let app = require('../../build/server/server').default

// reload signal from nodemon
process.once('SIGHUP', () => {
  app.server.close(() => {
    console.log('Reload server code')
    app = require('../../build/server/server').default
  })
})

// graceful shutdown
process.on('SIGTERM', () => {
  app.server.close(() => {
    console.log('Server was shutdown...')
    process.exit(0)
  })
})

