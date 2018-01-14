const path = require('path')
const Koa = require('koa')
const KoaRouter = require('koa-router')
const cors = require('kcors')
const log = require('log')
const koaBody = require('koa-body')
const uenv = require('uenv')
const error = require('./middlewares/error')

async function run () {
  const app = new Koa()
  const router = new KoaRouter()
  const routes = require('lazy-modules-directory')(path.join(__dirname, 'routes'))

  app.use(error)
  app.use(koaBody({ multipart: true }))
  app.use(cors())

  for (const name of Object.keys(routes)) {
    routes[name](router)
  }

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(uenv.get('api.port'))
  log.info('api listening on port %s', uenv.get('api.port'))
}

module.exports = run
