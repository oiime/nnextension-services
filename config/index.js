const path = require('path')
const uenv = require('uenv')

uenv.assign({
  env: process.env.NODE_ENV || 'development',
  dir_root: path.join(__dirname, '..')
})

require(path.join(__dirname, uenv.get('env')))
