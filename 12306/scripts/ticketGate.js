var station = $file.read('assets/station_names.json')
var stationObject = JSON.parse(station.string)
var tool = require('scripts/tool')

module.exports = {
    showTicketGate: showTicketGate
}

function showTicketGate() {
    $ui.push({
        props: {
            id: "superView",
            title: "检票口"
        },
        views: [{
            type: "input",
            props: {
                id: "year",
                align: $align.center,
                placeholder: "年",
                type: $kbType.number
            },
            layout: function(make) {
                make.top.inset(10)
                make.left.inset(10)
                make.height.equalTo(40)
            },
            events: {
                ready: function(sender) {
                    sender.text = tool.currentYear
                }
            }
        },
        {
            type: "input",
            props: {
                id: "month",
                align: $align.center,
                placeholder: "月",
                type: $kbType.number
            },
            layout: function(make) {
                make.top.inset(10)
                make.left.equalTo($("year").right).offset(5)
                make.height.equalTo(40)
                make.width.equalTo($("year").width)
            },
            events: {
                ready: function(sender) {
                    sender.text = tool.currentMonth
                }
            }
        },
        {
            type: "input",
            props: {
                id: "day",
                align: $align.center,
                placeholder: "日",
                type: $kbType.number
            },
            layout: function(make) {
                make.top.inset(10)
                make.left.equalTo($("month").right).offset(5)
                make.right.inset(10)
                make.height.equalTo(40)
                make.width.equalTo($("month").width)
            },
            events: {
                ready: function(sender) {
                    sender.text = tool.currentDay
                }
            }
        },{
            type: "input",
            props: {
                placeholder: "列车编号",
                type: $kbType.ascii,
                id:"trainNO",
                align: $align.center
            },
            layout: function(make) {
                make.top.equalTo($("year").bottom).offset(10)
                make.left.inset(10)
                make.height.equalTo(32)
            },
            events: {
                ready: function(sender) {
                    if ($cache.get("oldTicketGateCode")) {
                        sender.text = $cache.get("oldTicketGateCode")
                    }
                }
            }
        },{
            type: "input",
            props: {
                placeholder: "出发站",
                id:"departureStation",
                align: $align.center
            },
            layout: function(make) {
                make.top.equalTo($("trainNO"))
                make.left.equalTo($("trainNO").right).offset(5)
                make.width.equalTo($("trainNO"))
                make.height.equalTo(32)
            },
            events: {
                ready: function(sender) {
                    if ($cache.get("oldStation")) {
                        sender.text = $cache.get("oldStation")
                    }
                }
            }
        },
            {
                type: "button",
                props: {
                    title: "查询"
                },
                layout: function(make) {
                    make.top.equalTo($("trainNO"))
                    make.right.inset(10)
                    make.height.equalTo($("trainNO").height);
                    make.width.equalTo(100)
                    make.left.equalTo($("departureStation").right).offset(5)
                },
                events: {
                    tapped: function(sender) {
                        collapseKeyboard()
                        search()
                        $cache.set("oldTicketGateCode", $("trainNO").text)
                        $cache.set("oldStation", $("departureStation").text)
                    }
                }
            }, 
            {
                type: "label", 
                props: {
                    lines: 0,
                    font: $font(20),
                    align: $align.center,
                    textColor: $color("red")
                },
                layout: function(make, view) {
                    make.top.equalTo($("trainNO").bottom).offset(30)
                    make.left.right.inset(10)

                }
            }
        ]
    })
}

function collapseKeyboard() {
    $("trainNO").blur()
    $("departureStation").blur()
    $("year").blur()
    $("month").blur()
    $("day").blur()
}


function search() {
    var train_Code = $("trainNO").text.toUpperCase()
    $console.info(train_Code)
    var departureStation = stationObject[$("departureStation").text]
    $console.info(departureStation)
    var year = ($("year").text.length > 1) ? $("year").text : ("0" + $("year").text)
    var month = ($("month").text.length > 1) ? $("month").text : ("0" + $("month").text)
    var day = ($("day").text.length > 1) ? $("day").text : ("0" + $("day").text)

    var url = "https://www.12306.cn/index/otn/index12306/queryTicketCheck"
    $console.info(url)

    $ui.loading(true)
    $http.request({
        method: "POST",
        url: url,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
        body: {
            trainDate: year + "-" + month + "-" + day,
            station_train_code: train_Code,
            from_station_telecode: departureStation
        },
        handler: function(resp) {
            $ui.loading(false)
            $("label").text = resp.data.data + " (仅供参考)"
            $console.info(resp.data.data)
        }
    })
}