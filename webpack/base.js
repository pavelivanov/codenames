import path from 'path'
import webpack from 'webpack'


export default {
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
    },
    modules: [
      'node_modules',
      path.resolve('local_modules'),
      path.resolve('src'),
    ],
    extensions: [ '.js', '.ts', '.tsx', '.scss' ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve('local_modules'),
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      // default values for variables, they will be overwrote by real environment
      'NODE_ENV': 'development',
      'APP_VERSION': 'dev',
      'ASSETS_PATH': '/',
      'SENTRY_CLIENT_DSN': 'https://539ac1c7161f4ea388a2bc83d2b7aaa6@o375156.ingest.sentry.io/5607127',
      'SENTRY_SERVER_DSN': 'https://9f2c4a2d223a463985de9f6fbfa534dc@o375156.ingest.sentry.io/5607119',
    }),
    new webpack.DefinePlugin({
      '__DEV__': process.env.NODE_ENV === 'development',
    }),
    // replace graphql import to generated ts
    new webpack.NormalModuleReplacementPlugin(
      /(.*\.graphql)$/m,
      (resource) => {
        resource.request = resource.request.replace(/(.*\.graphql)$/m, '$1.ts')
      }
    ),
  ],
}
