const chunks = [
  {
    test: /node_modules/,
    name(module) {
      // get the name. E.g. node_modules/packageName/not/this/part.js
      // or node_modules/packageName
      const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]

      return `npm.${packageName.replace('@', '')}`
    },
  },
  {
    test: /local_modules/,
    name(module) {
      // get the name. E.g. local_modules/packageName/not/this/part.js
      // or local_modules/packageName
      const packageName = module.context.match(/[\\/]local_modules[\\/](.*?)([\\/]|$)/)[1]

      // npm package names are URL-safe, but some servers don't like @ symbols
      return `loc.${packageName.replace('@', '')}`
    },
  },
]

const scriptGroups = chunks.reduce((acc, { test, name }) => ({
  ...acc,
  [name]: {
    test,
    name,
    enforce: true,
  },
}), {})


export default {
  chunks: 'all',
  maxAsyncRequests: Infinity,
  maxInitialRequests: Infinity,
  cacheGroups: {
    ...scriptGroups,
    styles: {
      name: 'styles',
      test: /\.css$/,
      chunks: 'all',
      enforce: true,
    },
  },
}
