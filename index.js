'use strict'
var spawn = require('child_process').spawn
var request = require('request')

function UtilsCrier () {
  // check to see if the webserver is running
  var firstReq = true

  request
    .get('http://localhost:8989/')
    .on('response', function (response) {
      // server is already running
    })
    .on('error', function (error) {
      if (error) {
        console.log('Starting slack bot server')
        spawn('node', [`${__dirname}/lib/server.js`], {
          stdio: 'ignore', // piping all stdio to /dev/null
          detached: true
        }).unref()
      }
    })

  this.registrySay = (say) => {
    request.post({url: 'http://localhost:8989/registry', form: {say: say}}, (err, httpResponse, body) => {
      if (err) {
        if (firstReq) {
          // this is likely the first message so retry when the websocket is up
          setTimeout(() => {
            request.post({url: 'http://localhost:8989/registry', form: {say: say}}, (err, httpResponse, body) => {
              if (err) console.log(err)
            })
          }, 2000)
        }
      }
      firstReq = false
    })
  }
}

module.exports = exports = new UtilsCrier()
