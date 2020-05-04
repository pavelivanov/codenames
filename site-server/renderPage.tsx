import React from 'react'
import { minify as minifyHtml } from 'html-minifier'
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'

// @ts-ignore
import { routes } from 'build/js/server'
import assets from 'build/assets.json'


const render404 = (req, res) => {
  res.status(404)
  res.set('Content-Type', 'text/html')

  res.send(Buffer.from(minifyHtml(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>CodeNames - 404</title>
      <meta charset="utf-8">
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600&display=swap" rel="stylesheet">
      <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
      <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
      <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
      <link rel="manifest" href="/assets/manifest.json">
      <style>
        body, html {
          height:100%;
        }
        
        body{
          font-family: Source Sans Pro, -apple-system, sans-serif;
        }
      
        .page {
          height: 100%;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -webkit-align-items: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -webkit-justify-content: center;
          -ms-flex-pack: center;
          justify-content: center;
        }  
       
        .title {
          margin-top: 0;
          margin-bottom: 20px;
          text-align: center;
          font-weight: 500;
          font-size: 50px;
        }
        
        .text {
          text-align: center;
          font-weight: 300;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="page">
        <div>
          <h1 class="title">404</h1>
          <p class="text">Page you are looking for doesn't exist</p>
        </div>  
      </div>      
    </body>
    </html>
  `)))

  res.end()
}

const renderPage = async (req, res) => {
  const is404 = (
    req.path !== '/'
    && !/^\/board\/[A-Za-z0-9]+$/.test(req.path)
    || req.path === '/404'
  )

  if (is404) {
    console.error(`"${req.path}" not found!`)

    render404(req, res)
    return
  }

  const routerContext = {} as any
  const isBot = req.useragent.isBot || req.query.bot

  const html = renderToString(
    <StaticRouter location={req.url} context={routerContext}>
      {routes}
    </StaticRouter>
  )

  if (routerContext.url) {
    res.writeHead(301, { Location: routerContext.url })
    res.end()
  }
  else {
    res.set('Content-Type', 'text/html')

    const title = 'CodeNames - Play Online'
    const description = 'Play the Board game CodeNames with your friends online!'

    res.send(Buffer.from(minifyHtml(`
      <!DOCTYPE html>
      <html lang="en" prefix="og: http://ogp.me/ns#">
      <head>
        <title>${title}</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <meta name="title" content="${title}" />
        <meta name="description" content="${description}" />
        <meta name="keywords" content="codenames, game, online" />
        <meta property="og:url" content="https://codenames.wtf" />
        <meta property="og:title" content="${title}" />
        <meta property="og:image" content="https://codenames.wtf/assets/images/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="" />
        <meta property="og:description" content="${description}" />
        <meta property="og:site_name" content="CodeNames" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://codenames.wtf" />
        
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@200;300;400;600&display=swap" rel="stylesheet">
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/images/apple-touch-icon.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/images/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/images/favicon-16x16.png">
        <link rel="manifest" href="/assets/manifest.json">
        <link rel="stylesheet" href="/assets/${assets.client.css}" />
        
        <script type="application/ld+json">
          {
            "@context": "http://schema.org",
            "@type": "WebSite",
            "url": "https://codenames.wtf",
            "image": "https://codenames.wtf/assets/images/og-image.png",
            "name": "CodeNames",
            "description": "${description}",
            "alternateName": "The Board Game"
          }
        </script>
      </head>
      <body>
        <div id="root" style="height: 100%;">${html}</div>
        
        ${isBot ? '' : `
        <script src="/assets/${assets.modules.js}"></script>
        <script src="/assets/${assets.client.js}"></script>

        <!-- Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-165035140-1"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'UA-165035140-1');
        </script>
        <!-- / Google Analytics -->
        `}
      </body>
      </html>
    `, {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      removeComments: true,
    })))
  }
}


export default renderPage
