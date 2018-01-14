const log = require('log')

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.status = err.status || 500
    if (ctx.status === 500) {
      log.error(err)
      ctx.body = {
        status: 500,
        message: 'Internal error'
      }
      return
    }
    ctx.body = {
      status: err.status,
      message: err.message,
      reason: err.reason
    }
  }
}
