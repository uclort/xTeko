// 余票
var app = require('scripts/app')
// 时刻表
var timetable = require('scripts/timetable')
// 检票口
var ticketGate = require('scripts/ticketGate')
// 正晚点查询
var punctuality = require('scripts/punctuality')
// 正晚点查询
var update = require('scripts/update')

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
            layout: function (make) {
                make.left.right.inset(10)
                make.top.inset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    app.excessTicketInquiry()
                }

            }
        }, {
            type: "button",
            props: {
                id: "ticketCheck",
                title: "时刻表查询"
            },
            layout: function (make) {
                make.left.right.inset(10)
                make.top.equalTo($("button").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    timetable.showTimeTable()
                }

            }
        }, {
            type: "button",
            props: {
                id: "ticketGateCheck",
                title: "检票口查询"
            },
            layout: function (make) {
                make.left.right.inset(10)
                make.top.equalTo($("ticketCheck").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    ticketGate.showTicketGate()
                }

            }
        }, {
            type: "button",
            props: {
                id: "lateQuery",
                title: "正晚点查询"
            },
            layout: function (make) {
                make.left.right.inset(10)
                make.top.equalTo($("ticketGateCheck").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    punctuality.showPunctuality()
                }

            }
        }
        ]
    })
}

//检查版本
function updateData() {
    $http.get({
        url: "https://raw.githubusercontent.com/nlnlnull/xTeko/master/12306/UpdateInfo",
        handler: function (resp) {
            let excessTicketInquiryUrl = resp.data.excessTicketInquiryUrl
            let cookie = resp.data.Cookie
            let excessTicketInquiryUrl_Old = $cache.get("excessTicketInquiryUrl")
            let cookie_Old = $cache.get("cookie")
            if (!excessTicketInquiryUrl_Old || excessTicketInquiryUrl != excessTicketInquiryUrl_Old) {
                $cache.set("excessTicketInquiryUrl", excessTicketInquiryUrl)
                $ui.toast("余票查询接口已更新");
            }
            if (!cookie_Old || cookie != cookie_Old) {
                $cache.set("cookie", cookie)
                // $ui.toast("Cookie 已更新");
            }
        }
    })
}

updateData()
update.checkupVersion("https://raw.githubusercontent.com/nlnlnull/xTeko/master/12306/UpdateInfo")