import fs from 'fs'
import path from 'path'
import cors from 'cors'
import polka from 'polka'
import webpack from 'webpack'
import nodemon from 'nodemon'
import serve from 'serve-static'
import webpackDevMiddleware from 'webpack-dev-middleware'


// default value for easy development
process.env.ASSETS_PATH = process.env.ASSETS_PATH || 'http://localhost:3001/'

// this additional defence for ReactLoadablePlugin.
// There are rare cases when a plugin starts working even before the build folder is created.
if (!fs.existsSync('build/client')) {
  fs.mkdirSync('build/client', { recursive: true })
}

const compilerPromise = (name, compiler) => (
  new Promise((resolve, reject) => {
    compiler.hooks.compile.tap(name, () => {
      console.log(`[${name}] Compiling `)
    })

    compiler.hooks.done.tap(name, (stats) => (
      stats.hasErrors() ? reject(`Failed to compile ${name}`) : resolve()
    ))
  })
)

const start = async () => {
  const [ clientConfig, serverConfig ] = require('../../webpack')

  const multiCompiler = webpack([ clientConfig, serverConfig ])
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')
  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')

  const clientPromise = compilerPromise('client', clientCompiler)
  const serverPromise = compilerPromise('server', serverCompiler)

  // Start client app

  const app = polka()
  const clientPort = 3001

  app.use(cors())

  app.use(webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
  }))

  app.use('/', serve(path.resolve('build/client')))

  app.listen(clientPort, (err) => {
    if (err) {
      throw err
    }

    console.log(`Client App is listening on localhost:${clientPort}`)
  })

  // Start server compiler watcher

  const watchOptions = {
    ignored: /node_modules/,
    stats: clientConfig.stats,
  }

  serverCompiler.watch(watchOptions, (error, stats) => {
    console.log(stats.toString(serverConfig.stats))

    if (error) {
      console.error(error)
    }

    if (stats.hasErrors()) {
      const { errors } = stats.toJson()

      console.error(errors)
    }
  })

  // Wait until client and server are compiled

  try {
    await serverPromise
    await clientPromise
  }
  catch (error) {
    console.error(error)
    process.exit(1)
  }

  // Start server (SSR) app

  const script = nodemon({
    script: path.resolve('bin/serve'),
    watch: [ 'build/server' ],
    ignore: [ '*.map' ],
    signal: 'SIGHUP',
    delay: 200,
  })

  script.on('restart', () => {
    console.warn('SSR App has been restarted...')
  })

  script.on('quit', () => {
    console.log('Process ended')
    process.exit()
  })

  script.on('error', () => {
    console.error('An error occurred. Exiting')
    process.exit(1)
  })
}

start()
