import path from 'path'
import webpack from 'webpack'
import WebpackBar from 'webpackbar'
import merge from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'

import base from './base'
import rules from './rules'


const serverBase = merge(base, {
  name: 'server',
  target: 'node',
  entry: {
    server: path.resolve('server/index'),
  },
  output: {
    path: path.resolve('build/server'),
    filename: '[name].js',
    // to enable app export
    libraryTarget: 'commonjs',
  },
  externals: [
    nodeExternals({
      // we still want imported css from external files to be bundled otherwise 3rd party packages
      // which require us to include their own css would not work properly
      allowlist: [
        /\.css$/,
      ],
    }),
    {
      // webpack client compiler creates these json files
      // they are used by server app which compiled by webpack server compiler - till this process these files don't exist
      // we need them to be external to avoid error, when build completes and server be run with node json files be loaded
      // from build/ directory (node resolves this folder bcs it's declared in bin/serve/index.js as module directory)
      'build/client/loadableStats.json': 'commonjs2 build/client/loadableStats.json',
    },
    'react-helmet',
  ],
  module: {
    rules: rules.server,
  },
  plugins: [
    new WebpackBar({
      name: 'server',
      color: '#ff8500',
    }),
    new webpack.DefinePlugin({
      '__CLIENT__': '0',
      '__SERVER__': '1',
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1, // avoid creating multiple chunks
    }),
  ],
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    performance: false,
    reasons: false,
    timings: true,
    version: false,
  },
})

export const dev = merge(serverBase, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  performance: {
    hints: false,
  },
})

export const prod = merge(serverBase, {
  mode: 'production',
  devtool: 'source-map',
})
