import fs from 'fs'
import path from 'path'
import webpack from 'webpack'

import webpackConfigs from '../../webpack'


// this additional defence for ReactLoadablePlugin.
// There are rare cases when a plugin starts working even before the build folder is created.
if (!fs.existsSync(path.resolve('build/client'))) {
  fs.mkdirSync(path.resolve('build/client'), { recursive: true })
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

const build = async () => {
  const [ clientConfig, serverConfig ] = webpackConfigs

  const multiCompiler = webpack([ clientConfig, serverConfig ])

  const serverCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'server')
  const clientCompiler = multiCompiler.compilers.find((compiler) => compiler.name === 'client')

  const serverPromise = compilerPromise('server', serverCompiler)
  const clientPromise = compilerPromise('client', clientCompiler)

  serverCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(serverConfig.stats))
    }
    else {
      console.error(stats.compilation.errors)
    }
  })

  clientCompiler.watch({}, (error, stats) => {
    if (!error && !stats.hasErrors()) {
      console.log(stats.toString(clientConfig.stats))
    }
    else {
      console.error(stats.compilation.errors)
    }
  })

  try {
    await serverPromise
    await clientPromise
  }
  catch (error) {
    console.error(error)
    process.exit(1)
  }

  console.log('Build successful!')
  process.exit(0)
}

build()
