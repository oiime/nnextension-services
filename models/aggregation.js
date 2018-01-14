const TYPE_KEY = {
  COUNTRY_CODE: 1,
  ISP: 2
}

const COUNTER = {
  REQUESTS: 'requests',
  SIZE: 'size',
  SIZE_MEAN: 'size_mean',
  SIZE_MEDIAN: 'size_median',
  LATENCY: 'latency',
  LATENCY_MEAN: 'latency_mean',
  LATENCY_MEDIAN: 'latency_median',
  LATENCY_MAX: 'latency_max'
}

const ENTRY_MAP = [
  { counter: COUNTER.REQUESTS, property: 'requests' }
]

// temporary, replace with zset etc etc etc

module.exports = {
  methods: {
    incrByUserdata: async function (userdata, entry = {}) {
      const promises = []
      for (const keyMapping of ENTRY_MAP) {
        if (!entry.hasOwnProperty(keyMapping.property)) continue
        promises.push(this.incrby(`${TYPE_KEY.COUNTRY_CODE}:${userdata.countryCode}:${entry.domain}:${keyMapping.counter}:sum`, entry[keyMapping.property]))
        promises.push(this.incrby(`${TYPE_KEY.COUNTRY_CODE}:${userdata.countryCode}:${entry.domain}:${keyMapping.counter}:samples`, 1))
      }
      await Promise.all(promises)
    },
    getByUserdataDomain: async function (userdata, domain) {
      const keys = []
      const counters = {}

      for (const { property, counter } of ENTRY_MAP) {
        keys.push({ key: `${TYPE_KEY.COUNTRY_CODE}:${userdata.countryCode}:${domain}:${counter}:sum`, type: 'sum', property })
        keys.push({ key: `${TYPE_KEY.COUNTRY_CODE}:${userdata.countryCode}:${domain}:${counter}:samples`, type: 'samples', property })
      }
      const res = await this.mget(keys.map(key => key.key))
      keys.forEach(({ type, property }, idx) => {
        if (!res[idx]) throw new Error('this should never happen')
        if (!counters.hasOwnProperty(property)) counters[property] = {}
        counters[property][type] = parseInt(res[idx])
      })
      return counters
    }
  },
  name: 'aggregation',
  prefix: 'a'
}
