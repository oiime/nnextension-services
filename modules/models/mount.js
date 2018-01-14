module.exports = function ({ props, client }) {
  return Object.assign(props.methods || {}, {
    __prefix: props.prefix || props.name,
    __name: props.name || props.prefix,
    __client: client
  }, {
    get: function (key) {
      return this.__client.get(`${this.__prefix}:${key}`)
    },
    mget: function (keys) {
      return this.__client.mget(keys.map(key => `${this.__prefix}:${key}`))
    },
    set: function (key, value) {
      return this.__client.set(`${this.__prefix}:${key}`, value)
    },
    setex: function (key, ttl, value) {
      return this.__client.setex(`${this.__prefix}:${key}`, ttl, value)
    },
    incrby: function (key, incrby) {
      return this.__client.incrby(`${this.__prefix}:${key}`, parseInt(incrby))
    }
  })
}
