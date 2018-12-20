// 出发 = 1  到达 = 0
var cx_lx = 0

module.exports = {
    showPunctuality: showPunctuality
}

function showPunctuality() {
    $ui.push({
        props: {
            id: "superView",
            title: "正晚点"
        },
        views: [{
            type: "label", 
            props: {
                id: "tips",
                lines: 0,
                font: $font(14),
                align: $align.center,
                textColor: $color("#f07c82"),
                text: "本查询仅提供过去1小时和未来3小时内列车正晚点信息"
            },
            layout: function(make, view) {
                make.top.inset(10)
                make.left.right.inset(10)

            }
        },{
            type: "input",
            props: {
                placeholder: "车站",
                id:"station",
                align: $align.center
            },
            layout: function(make) {
                make.top.equalTo($("tips").bottom).offset(10)
                make.left.inset(10)
                make.height.equalTo(32)
            },
            events: {
                ready: function(sender) {
                    if ($cache.get("oldPunctualityStation")) {
                        sender.text = $cache.get("oldPunctualityStation")
                    }
                }
            }
        },{
            type: "input",
            props: {
                placeholder: "列车编号",
                type: $kbType.ascii,
                id:"trainTimes",
                align: $align.center
            },
            layout: function(make) {
                make.top.equalTo($("station"))
                make.left.equalTo($("station").right).offset(5)
                make.width.equalTo($("station"))
                make.right.inset(10)
                make.height.equalTo(32)
            },
            events: {
                ready: function(sender) {
                    if ($cache.get("oldTrainTimes")) {
                        sender.text = $cache.get("oldTrainTimes")
                    }
                }
            }
        },{
            type: "button",
            props: {
                title: "到达时间",
                id: "arrivals"
            },
            layout: function(make) {
                make.left.inset(10)
                make.top.equalTo($("station").bottom).offset(10)
                make.height.equalTo($("station").height);
            },
            events: {
                tapped: function(sender) {
                    cx_lx = 0
                    search()
                }
            }
        },{
            type: "button",
            props: {
                title: "出发时间",
                id: "setOff"
            },
            layout: function(make) {
                make.top.equalTo($("station").bottom).offset(10)
                make.left.equalTo($("arrivals").right).offset(5)
                make.right.inset(10)
                make.height.equalTo($("station").height);
                make.width.equalTo($("arrivals"))
            },
            events: {
                tapped: function(sender) {
                    cx_lx = 1
                    search()
                }
            }
        }, {
            type: "label", 
            props: {
                lines: 0,
                font: $font(20),
                align: $align.center,
                textColor: $color("red")
            },
            layout: function(make, view) {
                make.top.equalTo($("arrivals").bottom).offset(30)
                make.left.right.inset(10)

            }
        }
        ]
    })
}

function search() {
    collapseKeyboard()
    $cache.set("oldPunctualityStation", $("station").text)
    $cache.set("oldTrainTimes", $("trainTimes").text)

    var train_Code = $("trainTimes").text.toUpperCase()
    $console.info(train_Code)
    var departureStation = $("station").text
    $console.info(departureStation)

    var url = "https://kyfw.12306.cn/otn/zwdch/query"
    $console.info(url)

    $ui.loading(true)
    $http.request({
        method: "POST",
        url: url,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
        body: {
            cc: train_Code,
            cxlx: cx_lx,
            cz: departureStation,
            czEn: "-E5-8C-97-E4-BA-AC-E5-8D-97",
            randCode: ""
        },
        handler: function(resp) {
            $ui.loading(false)
            $("label").text = resp.data.data.message
            $console.info(resp.data.data)
        }
    })
}

function collapseKeyboard() {
    $("station").blur()
    $("trainTimes").blur()
}
