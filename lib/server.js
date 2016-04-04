var db = require('nypl-registry-utils-database')
var SlackBot = require('slackbots')
var express = require('express')
var bodyParser = require('body-parser')
var worked = false

var app = express()
var params = {
  icon_url: 'http://s3.amazonaws.com/data.nypl.org/billi.png'
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// the encrypted slack keys
var slackKeys = 'WqidZLYCvcHTKLWN/D/b4v4PHKOXIDc1M22jKPnbtSpKvIA5I+8tLwndkKzsfp1juzygr2iQMPckjXFCs4ttVh/HdwTYzFg5at4MUaYR/uafyXEEpgDxY5gYJrxlpVv7vfFrNdmqOFgzk4b7tNiIBI6ivImuwj09CsSqlJsNEQDToB41VwlgBq6xAgZh/yLtkPB/pEshL1h9RTfiCxM6NconVX4A+nb0LJXXeUSyUnSapneikmcGFWlNGMWMaPMN/N3HTZT3ina+nVUjg0mFcukauXtMqE0umMzjBKzUkR5u076yJ/a4jlQ8lSEyIRIiWZfBLOovTVpoACRmyVhf6Q=='

// where we store the keys
var slackRegistryKey = null
var keys = JSON.parse(db.setServerConfig(slackKeys))
slackRegistryKey = keys.sr
var slackBotRegistry = null

if (slackRegistryKey) {
  slackBotRegistry = new SlackBot({
    token: slackRegistryKey, // this.slackRegistryKey, // Add a bot https://my.slack.com/services/new/bot and put the token
    name: 'registry'
  })
}

app.post('/registry', function (req, res) {
  worked = true
  if (req.body && req.body.say) {
    slackBotRegistry.postMessageToChannel('data-monitor', req.body.say, params).always(function (data) {
      res.end(data)
    })
  }
})

app.get('/exit', function (req, res) {
  process.exit(0)
})
app.get('/', function (req, res) {
  worked = true
  res.send('online')
})
app.listen(8989, 'localhost', function () {
  console.log('Slack bridge listening on port 8989!')
})

setInterval(() => {
  if (!worked) process.exit(0)
  worked = false
}, 600000 * 2) // 1/2 hour
