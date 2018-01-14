const Ajv = require('ajv')
const ApiValidationError = require('../errors/api_validation_error')

const ajv = new Ajv({ coerceTypes: true, removeAdditional: true })

module.exports = function (schema) {
  const validate = ajv.compile(schema)
  return async function (ctx, next) {
    if (validate && !validate(ctx.request.body)) {
      throw new ApiValidationError('Content Error', validate.errors)
    }
    await next()
  }
}
