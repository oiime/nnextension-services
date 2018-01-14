/* eslint-env node, mocha */
require('../common')
const path = require('path')
const uenv = require('uenv')
const chai = require('chai')
const chaiHttp = require('chai-http')
const { expect } = chai

chai.use(chaiHttp)
const baseEndpoint = `http://localhost:${uenv.get('api.port')}`

describe('routes:state', function () {
  before(async function () {
    await require(path.join(uenv.get('dir_root'), 'services', 'api'))().catch(err => {
      // uncaught exception
      console.error('wtfff', err)
    })
  })
  it('should update state', function (done) {
    // look in redis before and after
    chai.request(baseEndpoint)
      .post('/state')
      .send({
        version: '0.0.1',
        return_state: true,
        domains: [
          {
            domain: 'example.com',
            requests: 1,
            size: 10,
            latency: 100
          }
        ]
      }).end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('domains')
        expect(res.body.domains[0].domain).to.equal('example.com')
        done(err)
      })
  })
})
