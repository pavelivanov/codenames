import http from 'http'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import useragent from 'express-useragent'


const PORT    = 3007
const app     = express()
const server  = http.createServer(app)

const router  = express.Router()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(useragent.express())
app.use('/rest', router)

server.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`)
})


export {
  server,
  router,
}
