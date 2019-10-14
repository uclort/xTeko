// 余票
var app = require('scripts/app')
// 时刻表
var timetable = require('scripts/timetable')
// 检票口
var ticketGate = require('scripts/ticketGate')
// 正晚点查询
var punctuality = require('scripts/punctuality')

currentVersion = $addin.current.version

if (currentVersion == undefined) {
    $addin.current.version = "1.0.0"
    currentVersion = $addin.current.version
}

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

checkupVersion()

//检查版本
function checkupVersion() {
    $http.get({
        url: "https://raw.githubusercontent.com/nlnlnull/xTeko/master/12306/UpdateInfo",
        handler: function (resp) {
            $console.info(resp.data)
            let version = resp.data.version
            let message = resp.data.message
            let updateUrl = resp.data.updateUrl

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
            $console.info(version);
            $console.info(currentVersion);

            if (versionCmp(version, $addin.current.version) == 1) {
                $ui.alert({
                    title: "发现新版本",
                    message: message,
                    actions: [
                        {
                            title: "更新",
                            handler: function () {
                                $addin.current.version = version
                                $app.openURL(updateUrl);
                                $addin.restart()
                            }
                        }
                    ]
                });
            }

        }
    })
}

// 不考虑字母
function s2i(s) {
    return s.split('').reduce(function (a, c) {
        var code = c.charCodeAt(0);
        if (48 <= code && code < 58) {
            a.push(code - 48);
        }
        return a;
    }, []).reduce(function (a, c) {
        return 10 * a + c;
    }, 0);
}

function versionCmp(s1, s2) {
    var a = s1.split('.').map(function (s) {
        return s2i(s);
    });
    var b = s2.split('.').map(function (s) {
        return s2i(s);
    });
    var n = a.length < b.length ? a.length : b.length;
    for (var i = 0; i < n; i++) {
        if (a[i] < b[i]) {
            return -1;
        } else if (a[i] > b[i]) {
            return 1;
        }
    }
    if (a.length < b.length) return -1;
    if (a.length > b.length) return 1;
    var last1 = s1.charCodeAt(s1.length - 1) | 0x20,
        last2 = s2.charCodeAt(s2.length - 1) | 0x20;
    return last1 > last2 ? 1 : last1 < last2 ? -1 : 0;
}