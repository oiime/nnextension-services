const path = require('path')
const uenv = require('uenv')
const Ioredis = require('ioredis')
const log = require('log')
const mount = require('./mount')

let _client

module.exports = require('lazy-modules-directory')(path.join(uenv.get('dir_root'), 'models'), {
  requireFn: (dirname, name) => {
    if (!_client) {
      _client = new Ioredis(uenv.get('redis'))
      _client.on('error', function (err) {
        log.error(err)
      })
      log.info('redis', 'connected to', uenv.get('redis'))
    }
    const props = require(path.join(dirname, name))
    return mount({ props, client: _client })
  }
})
