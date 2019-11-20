
let time = require('scripts/timeList')
let update = require('scripts/update')
time.render()

update.checkupVersion("https://raw.githubusercontent.com/nlnlnull/xTeko/master/Time/UpdateInfo")
