const uenv = require('uenv')

uenv.assign({
  redis: {
    port: 6379,
    host: '127.0.0.1'
  },
  api: {
    port: 8000
  },
  log: {
    stdout: true,
    level: 'info'
  }
})
