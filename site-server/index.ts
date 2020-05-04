import fs from 'fs'
import path from 'path'
import http from 'http'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import useragent from 'express-useragent'
import renderPage from './renderPage'


const PORT    = 5007
const app     = express()
const server  = http.createServer(app)
const sitemap = fs.readFileSync(path.resolve(__dirname, './sitemap.xml'), { encoding: 'utf-8' })

// app.get('/robots.txt', (req, res) => {
//   res.type('text/plain')
//   res.send('User-agent: *\nDisallow: /')
// })

app.get('/sitemap.xml', (req, res) => {
  res.type('text/xml')
  res.send(sitemap)
})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(useragent.express())
app.use('/assets', express.static(path.resolve('build'), { maxAge: 7 * 24 * 60 * 60 * 1000 })) // 7 days
app.use(renderPage)

server.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`)
})
