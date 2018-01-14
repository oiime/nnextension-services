const ApiError = require('./api_error')

class ApiValidationError extends ApiError {
  constructor (msg = 'Validation Failed', errors = {}) {
    super(msg)
    this.reason = errors
    this.status = 400
  }
}

module.exports = ApiValidationError
