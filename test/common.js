const path = require('path')
const { addPath } = require('app-module-path')

addPath(path.join(__dirname, '..', 'modules'))
require(path.join(__dirname, '..', 'config'))
