
let time = require('scripts/timeList')
let update = require('scripts/update')
time.render()

if ($app.env != $env.today) {
  update.checkupVersion("https://raw.githubusercontent.com/nlnlnull/xTeko/master/Time/UpdateInfo")
}

