const path = require('path')
const modPath = require('app-module-path')


const modules = [
  '',
  'local_modules',
  'site',
]

modules.forEach((modulePath) => {
  modPath.addPath(path.join(process.cwd(), modulePath))
})

require('@babel/register')({
  ignore: [
    path.resolve('build'),
    /node_modules/,
  ],
  extensions: [ '.js', '.ts', '.tsx' ],
})

require('dotenv').config()
