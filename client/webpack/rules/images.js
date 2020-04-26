const options = process.env.NODE_ENV === 'development' ? {
  name: 'images/[name]_[hash:6].[ext]',
} : {
  name: '[name]_[hash:6].[ext]',
  outputPath: 'images/',
}


export default [
  {
    test: /images.*\.(png|ico|jpg|jpeg|gif|svg|mp4)(\?.*)?$/,
    loader: 'file-loader',
    options,
  },
]
