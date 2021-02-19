import Head from 'next/head'
import '@/helpers/socket'

import '../scss/globals.scss'


const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>CodeNames - Play Online</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
    </Head>
    <Component {...pageProps} />
  </>
)


export default MyApp
