import Document, { Html, Head, Main, NextScript } from 'next/document'


class MyDocument extends Document {

  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)

    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <title>CodeNames - Play Online</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@200;400;600;700&display=swap" rel="stylesheet" />

          <link rel="apple-touch-icon" sizes="180x180" href="/static/favicon/apple-touch-icon.png"/>
          <link rel="icon" type="image/png" sizes="32x32" href="/static/favicon/favicon-32x32.png"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/static/favicon/favicon-16x16.png"/>
          <link rel="manifest" href="/static/favicon/site.webmanifest"/>
          <link rel="mask-icon" href="/static/favicon/safari-pinned-tab.svg" color="#000000"/>
          <link rel="shortcut icon" href="/static/favicon/favicon.ico"/>
          <meta name="msapplication-TileColor" content="#000000"/>
          <meta name="msapplication-config" content="/static/favicon/browserconfig.xml"/>
          <meta name="theme-color" content="#000"/>
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    )
  }
}


export default MyDocument
