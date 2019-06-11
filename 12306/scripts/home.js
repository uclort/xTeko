scriptVersion = 5.0

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

var erotsTxt = $file.exists("erots.txt")
if (erotsInstall() == false && erotsTxt == false) {
    $ui.alert({
        title: "提示",
        message: "您尚未安装 Erots 脚本商店，此脚本已取消自动更新机制，以后的更新都在 Erots 脚本商店中发布，是否安装 Erots 脚本商店？（点击忽略则以后不再提示）",
        actions: [{
            title: "忽略",
            handler: function () {
                $file.write({
                    data: $data({ string: "" }),
                    path: "erots.txt"
                })
            }
        },
        {
            title: "安装",
            handler: function () {
                $ui.loading(true);
                $http.download({
                    url: "https://github.com/LiuGuoGY/JSBox-addins/raw/master/Erots/.output/Erots.box?raw=true",
                    showsProgress: false,
                    timeout: 5,
                    progress: function (bytesWritten, totalBytes) {
                        var percentage = bytesWritten * 1.0 / totalBytes
                        $ui.progress(percentage, "下载中...")
                    },
                    handler: function (resp) {
                        var file = resp.data;
                        $addin.save({
                            name: "Erots",
                            data: file,
                            handler: function (success) {
                                $ui.loading(false);
                                $ui.alert({
                                    title: "安装完成",
                                    actions: [{
                                        title: "确定",
                                        handler: function () {
                                            if ($app.env = $env.app) {
                                                $addin.run("Erots")
                                            }
                                        }
                                    }],
                                });
                            }
                        });
                    }
                });
            }
        }
        ]
    });
}

function erotsInstall() {
    var addins = $addin.list
    let i = addins.length
    while (i--) {
        let item = addins[i]
        let name = item.name
        if (name == "Erots") {
            return true
        }
    }
    return false
}

checkupVersion()

//检查版本
function checkupVersion() {
    $http.get({
        url: "https://raw.githubusercontent.com/nlnlnull/xTeko/master/12306/UpdateInfo",
        handler: function (resp) {
            $console.info(resp.data)
            var version = resp.data.version
            var message = resp.data.message
            var updateUrl = resp.data.updateUrl
            var excessTicketInquiryUrl = resp.data.excessTicketInquiryUrl

            var excessTicketInquiryUrl_Old = $cache.get("excessTicketInquiryUrl")
            if (!excessTicketInquiryUrl_Old || excessTicketInquiryUrl != excessTicketInquiryUrl_Old) {
                $cache.set("excessTicketInquiryUrl", excessTicketInquiryUrl)
                $ui.toast("余票查询接口已更新");
            }
            return
            if (version > scriptVersion) {
                $ui.alert({
                    title: "发现新版本",
                    message: message,
                    actions: [{
                        title: "忽略",
                        handler: function () { }
                    },
                    {
                        title: "更新",
                        handler: function () {
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