const DEFAULT_TTL = 60 * 45 // 45 minutes

module.exports = {
  methods: {
    notify: async function (ip, domain) {
      const key = `${ip}:${domain}`
      const exists = await this.get(key)
      if (exists !== null) return true
      await this.setex(key, DEFAULT_TTL, 1)
      return false
    }
  },
  name: 'throttle',
  prefix: 't'
}
