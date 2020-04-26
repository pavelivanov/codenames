import express from 'express'
import webpack from 'webpack'
import historyApiFallback from 'connect-history-api-fallback'
import webpackMiddleware from 'webpack-dev-middleware'

import webpackConfig from '../../webpack/dev'


const PORT = 5007
const app = express()
const compiler = webpack(webpackConfig)

app.get('/favicon.ico', (req, res) => res.status(204))

app.use(historyApiFallback())
app.use(webpackMiddleware(compiler, webpackConfig.devServer))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.listen(PORT, () => {
  console.log(`App running on localhost:${PORT}`)
})
