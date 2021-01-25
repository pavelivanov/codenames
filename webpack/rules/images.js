export default ({ isClient }) => {
  const createLoader = (path) => ({
    loader: 'file-loader',
    options: {
      name: '[name]_[contenthash:6].[ext]',
      outputPath: `${path}/`,
      publicPath: `${process.env.ASSETS_PATH}${path}/`,
      // If true, emits a file (writes a file to the filesystem). If false, the loader will return a public URI
      // but will not emit the file. It is often useful to disable this option for server-side packages.
      emitFile: isClient,
    },
  })

  return [
    {
      test: /images.*\.(png|jpg|jpeg)(\?.*)?$/,
      use: [
        createLoader('images'),
      ],
    },
    {
      // .svg and .gif images should be loaded to different folder on S3 to exclude them from being processed by resize worker
      test: /images.*\.(svg)(\?.*)?$/,
      use: [
        createLoader('images-svg'),
      ],
    },
    {
      test: /images.*\.(gif)(\?.*)?$/,
      use: [
        createLoader('images-gif'),
      ],
    },
  ]
}
