if (process.env.NODE_ENV === 'development') {
  require('../../site-server/dev')
}
else {
  require('../../site-server')
}
