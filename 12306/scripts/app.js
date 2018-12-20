var ticketCheck = require('scripts/ticketCheck')
var tool = require('scripts/tool')
var station = $file.read('assets/station_names.json')
var stationObject = JSON.parse(station.string)
var station_anti = $file.read('assets/station_names_anti.json')
var stationObject_anti = JSON.parse(station_anti.string)

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
                layout: function(make) {
                    make.top.left.inset(10)
                    make.height.equalTo(50)
                },
                events: {
                    ready: function(sender) {
                        if ($cache.get("oldTicketInquiryDepartureStation")) {
                            sender.text = $cache.get("oldTicketInquiryDepartureStation")
                        }
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
                layout: function(make) {
                    make.top.right.inset(10)
                    make.left.equalTo($("departureStation").right).offset(10)
                    make.height.equalTo(50)
                    make.width.equalTo($("departureStation").width)
                },
                events: {
                    ready: function(sender) {
                        if ($cache.get("oldTicketInquiryTerminalStation")) {
                            sender.text = $cache.get("oldTicketInquiryTerminalStation")
                        }
                    }
                }
            },
            {
                type: "input",
                props: {
                    id: "year",
                    align: $align.center,
                    placeholder: "年"
                },
                layout: function(make) {
                    make.top.equalTo($("departureStation").bottom).offset(10)
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
                    placeholder: "月"
                },
                layout: function(make) {
                    make.top.equalTo($("departureStation").bottom).offset(10)
                    make.left.equalTo($("year").right).offset(10)
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
                    placeholder: "日"
                },
                layout: function(make) {
                    make.top.equalTo($("departureStation").bottom).offset(10)
                    make.left.equalTo($("month").right).offset(10)
                    make.right.inset(10)
                    make.height.equalTo(40)
                    make.width.equalTo($("month").width)
                },
                events: {
                    ready: function(sender) {
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
                layout: function(make) {
                    make.left.right.inset(10)
                    make.top.equalTo($("day").bottom).offset(10)
                    make.height.equalTo(50)
                },
                events: {
                    tapped: function(sender) {
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
    var url = "https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=" + year + "-" + month + "-" + day + "&leftTicketDTO.from_station=" + departureStation + "&leftTicketDTO.to_station=" + terminalStation + "&purpose_codes=ADULT"
    $console.info(departureStation)
    $console.info(terminalStation)
    $console.info(url)

    $ui.loading(true)
    $http.request({
        method: "GET",
        url: url,
        handler: function(resp) {
            $console.info(resp)
            $ui.loading(false)
            var resultGroup = resp.data.data.result.map(function(item) {
                var resultTuple = item.split("|")
                return { station_code: { text: resultTuple[3] }, site_name: { text: stationObject_anti[resultTuple[6]] + "-" + stationObject_anti[resultTuple[7]] }, total_time: { text: resultTuple[8] + "-" + resultTuple[9] }, stopover_time: { text: resultTuple[10] }, excess_ticket: { text: tool.excessTicket(resultTuple) } }
            })
            $console.info(resultGroup)
            ticketCheck.showTicketCheck()
            ticketCheck.giveData(resultGroup)
        }
    })
}

