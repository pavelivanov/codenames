import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import WebpackBar from 'webpackbar'
import TerserPlugin from 'terser-webpack-plugin'
import { GenerateSW } from 'workbox-webpack-plugin'
import LoadablePlugin from '@loadable/webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import DuplicatePackageCheckerPlugin from 'duplicate-package-checker-webpack-plugin'


import base from './base'
import rules from './rules'
import splitChunks from './config/splitChunks'


const minimizer = new TerserPlugin({
  // TerserPlugin config is taken entirely from react-scripts
  terserOptions: {
    parse: {
      // we want terser to parse ecma 8 code. However, we don't want it
      // to apply any minfication steps that turns valid ecma 5 code
      // into invalid ecma 5 code. This is why the 'compress' and 'output'
      // sections only apply transformations that are ecma 5 safe
      // https://github.com/facebook/create-react-app/pull/4234
      ecma: 8,
    },
    compress: {
      ecma: 5,
      warnings: false,
      // Disabled because of an issue with Uglify breaking seemingly valid code:
      // https://github.com/facebook/create-react-app/issues/2376
      // Pending further investigation:
      // https://github.com/mishoo/UglifyJS2/issues/2011
      comparisons: false,
      // Disabled because of an issue with Terser breaking valid code:
      // https://github.com/facebook/create-react-app/issues/5250
      // Pending futher investigation:
      // https://github.com/terser-js/terser/issues/120
      inline: 2,
    },
    mangle: {
      safari10: true,
    },
    output: {
      ecma: 5,
      comments: false,
      // Turned on because emoji and regex is not minified properly using default
      // https://github.com/facebook/create-react-app/issues/2488
      ascii_only: true,
    },
  },
  // Use multi-process parallel running to improve the build speed
  // Default number of concurrent runs: os.cpus().length - 1
  parallel: true,
})

const clientBase = merge(base, {
  name: 'client',
  target: 'web',
  entry: {
    client: path.resolve('client/index'),
  },
  output: {
    path: path.resolve('build/client'),
    filename: 'js/[name].[fullhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
  },
  module: {
    rules: rules.client,
  },
  plugins: [
    new LoadablePlugin({
      filename: 'loadableStats.json',
      writeToDisk: true,
    }),
    new WebpackBar({
      name: 'client',
      color: '#23ff78',
    }),
    new webpack.DefinePlugin({
      '__CLIENT__': '1',
      '__SERVER__': '0',
    }),
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV === 'development' ? 'css/[name].css' : 'css/[name].[contenthash].css',
      chunkFilename: process.env.NODE_ENV === 'development' ? 'css/[id].css' : 'css/[id].[contenthash].css',
      ignoreOrder: true,
    }),
  ],
  node: false,
  stats: {
    cached: false,
    cachedAssets: false,
    chunks: false,
    chunkModules: false,
    children: false,
    colors: true,
    hash: false,
    modules: false,
    reasons: false,
    timings: true,
    version: false,
  },
})

export const dev = merge(clientBase, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [], // for it will not delete loadableStats.json
    }),
  ],
  performance: {
    hints: false,
  },
  // optimization: {
  //   moduleIds: 'named',
  //   emitOnErrors: true,
  //   splitChunks,
  // },
})

export const prod = merge(clientBase, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new DuplicatePackageCheckerPlugin(),
    new GenerateSW({
      swDest: 'js/service-worker.js',
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  optimization: {
    minimizer: [ minimizer ],
    emitOnErrors: true,
    splitChunks,
  },
})
