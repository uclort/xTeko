scriptVersion = 3.8

// 余票
var app = require('scripts/app')
// 时刻表
var timetable = require('scripts/timetable')
// 检票口
var ticketGate = require('scripts/ticketGate')
// 正晚点查询
var punctuality = require('scripts/punctuality')

module.exports.render = function render() {
    $ui.render({
        props: {
            title: "12306"
        },
        views: [{
            type: "button",
            props: {
                title: "余票查询"
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
        },{
            type: "button",
            props: {
                id: "ticketCheck",
                title: "时刻表查询"
            },
            layout: function(make) {
                make.left.right.inset(10)
                make.top.equalTo($("button").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function(sender) {
                    timetable.showTimeTable()
                }

            }
        },{
            type: "button",
            props: {
                id: "ticketGateCheck",
                title: "检票口查询"
            },
            layout: function(make) {
                make.left.right.inset(10)
                make.top.equalTo($("ticketCheck").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function(sender) {
                    ticketGate.showTicketGate()
                }

            }
        },{
            type: "button",
            props: {
                id: "lateQuery",
                title: "正晚点查询"
            },
            layout: function(make) {
                make.left.right.inset(10)
                make.top.equalTo($("ticketGateCheck").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function(sender) {
                    punctuality.showPunctuality()
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
        url: "https://raw.githubusercontent.com/nlnlnull/xTeko/master/12306/UpdateInfo",
        handler: function(resp) {
            $console.info(resp.data)
            var version = resp.data.version
            var message = resp.data.message
            var updateUrl = resp.data.updateUrl
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