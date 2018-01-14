// @TODO placeholder, implement a real thing (maxmind etc etc)

class Userdata {
  constructor (ctx) {
    this.__ctx = ctx
  }
  get countryCode () {
    return 'LT'
  }
  get isp () {
    return 'unknown'
  }
}

module.exports = Userdata
