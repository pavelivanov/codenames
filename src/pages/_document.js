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
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
          <link rel="icon" type="image/svg+xml" href="/static/favicon/favicon.svg" />
          <link rel="alternate icon" href="/static/favicon/favicon.ico" />
          <link rel="mask-icon" href="/static/favicon/favicon.svg" color="#ff8a01" />
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
