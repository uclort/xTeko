var ticketCheck = require('scripts/ticketCheck')
var tool = require('scripts/tool')
var station = $file.read('assets/station_name.json')
var stationObject = JSON.parse(station.string)
var station_anti = $file.read('assets/station_name_anti.json')
var stationObject_anti = JSON.parse(station_anti.string)
var stationList = require('scripts/stationList')

module.exports = {
    excessTicketInquiry: excessTicketInquiry
}

function excessTicketInquiry() {
    $ui.push({
        props: {
            title: "12306"
        },
        views: [{
            type: "input",
            props: {
                id: "departureStation",
                align: $align.center,
                placeholder: "出发地"
            },
            layout: function (make) {
                make.top.left.inset(10)
                make.height.equalTo(50)
            },
            events: {
                ready: function (sender) {
                    if ($cache.get("oldTicketInquiryDepartureStation")) {
                        sender.text = $cache.get("oldTicketInquiryDepartureStation")
                    }
                }
            }
        }, {
            type: "button",
            props: {
                id: "station-button",
                align: $align.center,
                bgcolor: $color("clear")
            },
            layout: function (make) {
                make.edges.equalTo($("departureStation"))
            },
            events: {
                tapped: function (sender) {
                    stationList.showStationList("departureStation")
                    // $console.info("string");
                }
            }
        }, {
            type: "button",
            props: {
                id: "conversion-button",
                icon: $icon("162", $color("red"), $size(20, 20)),
                bgcolor: $color("clear")
            },
            layout: function (make, view) {
                make.top.equalTo($("departureStation"))
                make.size.equalTo($size(50, 50))
                make.centerX.equalTo(view)
                make.left.equalTo($("departureStation").right).offset(10)
            },
            events: {
                tapped: function (sender) {
                    let conversionString = $("departureStation").text
                    $("departureStation").text = $("terminalStation").text
                    $("terminalStation").text = conversionString
                }
            }
        },
        {
            type: "input",
            props: {
                id: "terminalStation",
                align: $align.center,
                placeholder: "目的地"
            },
            layout: function (make) {
                make.top.right.inset(10)
                make.left.equalTo($("conversion-button").right).offset(10)
                make.height.equalTo(50)
                make.width.equalTo($("departureStation").width)
            },
            events: {
                ready: function (sender) {
                    if ($cache.get("oldTicketInquiryTerminalStation")) {
                        sender.text = $cache.get("oldTicketInquiryTerminalStation")
                    }
                }
            }
        }, {
            type: "button",
            props: {
                id: "station-button",
                align: $align.center,
                bgcolor: $color("clear")
            },
            layout: function (make) {
                make.edges.equalTo($("terminalStation"))
            },
            events: {
                tapped: function (sender) {
                    stationList.showStationList("terminalStation")
                    // $console.info("string");
                }
            }
        },
        {
            type: "input",
            props: {
                id: "year",
                align: $align.center,
                placeholder: "年",
                type: $kbType.number
            },
            layout: function (make) {
                make.top.equalTo($("departureStation").bottom).offset(10)
                make.left.inset(10)
                make.height.equalTo(40)
            },
            events: {
                ready: function (sender) {
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
            layout: function (make) {
                make.top.equalTo($("departureStation").bottom).offset(10)
                make.left.equalTo($("year").right).offset(10)
                make.height.equalTo(40)
                make.width.equalTo($("year").width)
            },
            events: {
                ready: function (sender) {
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
            layout: function (make) {
                make.top.equalTo($("departureStation").bottom).offset(10)
                make.left.equalTo($("month").right).offset(10)
                make.right.inset(10)
                make.height.equalTo(40)
                make.width.equalTo($("month").width)
            },
            events: {
                ready: function (sender) {
                    sender.text = tool.currentDay
                }
            }
        },
        {
            type: "button",
            props: {
                id: "ticketCheck",
                title: "查询"
            },
            layout: function (make) {
                make.left.right.inset(10)
                make.top.equalTo($("day").bottom).offset(10)
                make.height.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    search()
                }

            }
        }
        ]
    })
}

function search() {

    $("departureStation").blur()
    $("terminalStation").blur()
    $cache.set("oldTicketInquiryDepartureStation", $("departureStation").text)
    $cache.set("oldTicketInquiryTerminalStation", $("terminalStation").text)

    var year = ($("year").text.length > 1) ? $("year").text : ("0" + $("year").text)
    var month = ($("month").text.length > 1) ? $("month").text : ("0" + $("month").text)
    var day = ($("day").text.length > 1) ? $("day").text : ("0" + $("day").text)

    var departureStation = stationObject[$("departureStation").text]
    var terminalStation = stationObject[$("terminalStation").text]
    var excessTicketInquiryUrl = $cache.get("excessTicketInquiryUrl")
    var url = excessTicketInquiryUrl + "?leftTicketDTO.train_date=" + year + "-" + month + "-" + day + "&leftTicketDTO.from_station=" + departureStation + "&leftTicketDTO.to_station=" + terminalStation + "&purpose_codes=ADULT"
    // $console.info(departureStation)
    // $console.info(terminalStation)
    // $console.info(url)

    $ui.loading(true)
    $http.request({
        method: "GET",
        url: url,
        handler: function (resp) {
            // $console.info(resp)
            if (resp.data.httpstatus != 200) {
                $console.info("数据出错，重新获取...")
                search()
                return
            }
            $ui.loading(false)
            var resultGroup = resp.data.data.result.map(function (item) {
                var resultTuple = item.split("|")
                return { station_code: { text: resultTuple[3] }, site_name: { text: stationObject_anti[resultTuple[6]] + "-" + stationObject_anti[resultTuple[7]] }, total_time: { text: resultTuple[8] + "-" + resultTuple[9] }, stopover_time: { text: resultTuple[10] }, excess_ticket: { text: tool.excessTicket(resultTuple) } }
            })
            ticketCheck.showTicketCheck()
            ticketCheck.giveData(resultGroup)
        }
    })
}

