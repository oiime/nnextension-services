class ApiError extends Error {
  toJSON () {
    return {
      message: this.message,
      status: this.status
    }
  }
}

module.exports = ApiError
