/* global describe, it */

'use strict'
var assert = require('assert') // eslint-disable-line
var should = require('should') // eslint-disable-line
var index = require('../index')

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'travis') {
  describe('index.js', function () {
    it('it decrypt the slack keys', function () {
      index.slackRegistryKey.should.be.type('string')
    })

    it('Says something', function (done) {
      this.timeout(10000)
      index.registrySay('TEST!', () => {
        done()
      })
    })
  })
}
