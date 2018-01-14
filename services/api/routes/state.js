const Promise = require('bluebird')
const models = require('models')
const Userdata = require('userdata')
const validate = require('../middlewares/validate')

module.exports = (router) => {
  // @TODO userdata needs to be created properly, throttleing is weak, no range injection validation etc etc
  router.post('/state', validate({
    type: 'object',
    additionalProperties: false,
    properties: {
      version: { type: 'string' },
      return_state: { type: 'boolean' },
      domains: {
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            domain: { type: 'string' },
            requests: { type: 'integer' },
            size: { type: 'integer' },
            size_mean: { type: 'integer' },
            size_median: { type: 'integer' },
            latency: { type: 'integer' },
            latency_mean: { type: 'integer' },
            latency_median: { type: 'integer' },
            latency_max: { type: 'integer' }
          },
          required: ['domain']
        }
      }
    },
    required: ['version', 'domains']
  }), async function (ctx) {
    const userdata = new Userdata(ctx)
    const responsePayload = { domains: [] }

    await Promise.map(ctx.request.body.domains, async entry => {
      const throttled = await models.throttle.notify(userdata.ip, entry.domain)
      if (ctx.request.body.return_state) {
        const state = await models.aggregation.getByUserdataDomain(userdata, 'abc.com')
        responsePayload.domains.push(Object.assign({ domain: entry.domain }, state))
      }
      if (!throttled) {
        await models.aggregation.incrByUserdata(userdata, { domain: 'abc.com', requests: 10, size: 1000, latency: 500 })
      }
    }, { concurrency: 10 })

    ctx.body = responsePayload
  })
}
