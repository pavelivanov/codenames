const config = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          browsers: [
            'last 2 versions',
          ],
        },
        useBuiltIns: 'usage',
        corejs: '3',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    // '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-transform-destructuring',
    // '@babel/plugin-proposal-class-properties',
    // '@babel/plugin-proposal-object-rest-spread',
  ],
}


module.exports = config
