import webpack from 'webpack'
import chalk from 'chalk'
import _debug from 'debug'

const debug           = _debug('app:bin:compile')
const webpackConfig   = require(`../../webpack/${process.env.WEBPACK}`).default
const compiler        = webpack(webpackConfig)

debug('\nWebpack compilation started!')

compiler.run((err, stats) => {
  if (err) {
    debug(chalk.red(err))
    process.exit(1)
  }
  else {
    const jsonStats = stats.toJson()
    const { errors, warnings } = jsonStats

    debug('Webpack compilation finished!')

    console.log(stats.toString({
      colors: true,
      chunks: false,
      hash: false,
      version: false,
      assets: false,
      children: false,
      source: false,
      warnings: true,
      noInfo: true,
      modules: false,
      errors: true,
      reasons: true,
      errorDetails: true,
    }))

    if (errors && errors.length) {
      debug(chalk.red(jsonStats.errors))
      process.exit(1)
    }
    else if (warnings && warnings.length) {
      // debug(chalk.yellow(jsonStats.warnings))
    }
    else {
      debug('All done - everything is good to go.')
      process.exit(0)
    }
  }
})
