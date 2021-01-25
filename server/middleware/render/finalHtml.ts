import { minify } from 'html-minifier'


const getStatusCode = ({ helmet }): number => {
  if (helmet) {
    const bodyAttributes = helmet.bodyAttributes.toString()
    const match = bodyAttributes.match(/statusCode="(\d+)"/)

    if (match) {
      return Number(match[1])
    }
  }

  return 200
}

const getMeta = ({ helmet }: Server.Request['state']) => {
  if (!helmet) {
    return '<title>CodeNames - Play Online</title>'
  }

  return `
    ${helmet.base.toString()}
    ${helmet.title.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.script.toString()}
  `
}

const getData = ({ device }: Server.Request['state']) => `
  <script>
    window.__DEVICE__ = ${JSON.stringify(device)};
  </script>
`

const finalHtml: Server.Middleware = (req, res) => {
  const { appHtml, assets: { scripts, styles } } = req.state

  const statusCode = getStatusCode(req.state)
  const meta = getMeta(req.state)
  const data = getData(req.state)

  const html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        ${meta}
        ${styles}
      </head>
      <body>
        <div id="root" style="height: 100%; overflow-x: hidden;">${appHtml}</div>
        ${data}
        ${scripts}
      </body>
    </html>
  `

  const finalHtml = minify(html, { collapseWhitespace: true })

  res.writeHead(statusCode, { 'Content-Type': 'text/html' })
  res.end(finalHtml)
}


export default finalHtml
