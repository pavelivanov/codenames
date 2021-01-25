if (process.env.NODE_ENV === 'production') {
  module.exports = [
    require('./client').prod,
    require('./server').prod,
  ]
}
else {
  module.exports = [
    require('./client').dev,
    require('./server').dev,
  ]
}
