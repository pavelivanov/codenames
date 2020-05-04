import webpack from 'webpack'
import basePath from 'base-path'

import rulesMap from './rules'


const globals = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.WEBPACK': JSON.stringify(process.env.WEBPACK),
}

const rules = Object.keys(rulesMap)
  .map((k) => rulesMap[k])
  .map((rule) => Array.isArray(rule) ? rule : (rule.default || rule[process.env.NODE_ENV]))
  .reduce((result, rule) => result.concat(rule), [])

const webpackConfig = {
  mode: process.env.NODE_ENV,
  module: {
    rules,
  },
  resolve: {
    alias: {
      'shared': basePath('shared'),
    },
    modules: [ 'local_modules', 'node_modules', 'site' ],
    extensions: [ '.js', '.ts', '.tsx', '.scss' ],
    plugins: [],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      basePath('local_modules'),
    ],
  },
  plugins: [
    new webpack.DefinePlugin(globals),
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /en-gb/
    ),
  ],
}


export default webpackConfig
