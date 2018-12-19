scriptVersion = 1.7

var app = require('scripts/app')
var timetable = require('scripts/timetable')
var ticketcCheck = require('scripts/ticketcCheck')
var tool = require('scripts/tool')
var station = $file.read('assets/station_names.json')
var stationObject = JSON.parse(station.string)
var station_anti = $file.read('assets/station_names_anti.json')
var stationObject_anti = JSON.parse(station_anti.string)

module.exports.render = function render() {
    $ui.render({
        props: {
            title: "12306"
        },
        views: [{
                type: "button",
                props: {
                    id: "ticketcCheck",
                    title: "查询余票"
                },
                layout: function(make) {
                    make.left.right.inset(10)
                    make.top.inset(10)
                    make.height.equalTo(50)
                },
                events: {
                    tapped: function(sender) {
                        app.excessTicketInquiry()
                    }

                }
            },
            {
                type: "button",
                props: {
                    title: "时刻表查询"
                },
                layout: function(make) {
                    make.left.right.inset(10)
                    make.top.equalTo($("ticketcCheck").bottom).offset(10)
                    make.height.equalTo(50)
                },
                events: {
                    tapped: function(sender) {
                        timetable.showTimeTable()
                    }

                }
            }
        ]
    })
}

checkupVersion()

//检查版本
function checkupVersion() {
    $http.get({
        url: "https://raw.githubusercontent.com/0x00000cc/xTeko/master/12306/UpdateInfo",
        handler: function(resp) {
            $console.info(resp.data)
            var version = resp.data.version
            var message = resp.data.message
            var updateUrl = resp.data.updateUrl
            $console.info(updateUrl);
            if (version > scriptVersion) {
                $ui.alert({
                    title: "发现新版本",
                    message: message,
                    actions: [{
                            title: "忽略",
                            handler: function() {}
                        },
                        {
                            title: "更新",
                            handler: function() {
                                $app.openURL(encodeURI(updateUrl))
                                $app.close()
                            }
                        }
                    ]
                })
            }
        }
    })
}