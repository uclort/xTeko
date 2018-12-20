

module.exports = {
    showTicketCheck: showTicketCheck,
    giveData: giveData
}

function showTicketCheck() {
    $ui.push({
        props: {
            title: "余票查询"
        },
        views: [{
            type: "list",
            props: {
                id: "list",
                rowHeight: 80,
                template: [{
                    type: "label",
                    props: {
                        id: "station_code", // 列车编号
                        align: $align.center,
                    },
                    layout: function(make, view) {
                        make.left.top.inset(10)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "site_name", // 出发站 - 目的地,
                        align: $align.center,
                    },
                    layout: function(make, view) {
                        make.top.inset(10)
                        make.centerX.equalTo(view.super.centerX);
                    }
                }, {
                    type: "label",
                    props: {
                        id: "total_time", // 出发时间 - 到达时间
                        align: $align.center,
                    },
                    layout: function(make, view) {
                        make.top.right.inset(10)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "stopover_time", // 停靠时长
                        align: $align.center,
                    },
                    layout: function(make, view) {
                        make.top.equalTo($("total_time").bottom).offset(10)
                        make.right.equalTo($("total_time").right)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "excess_ticket", // 余票
                        lines: 0,
                        font: $font(13)
                    },
                    layout: function(make, view) {
                        make.top.equalTo($("station_code").bottom).offset(10)
                        make.left.equalTo($("station_code").left)
                        make.right.equalTo($("stopover_time").left).offset(-80)
                    }
                }]
            },
            layout: function(make, view) {
                make.edges.equalTo(view.super)
            }
        }]
    })
}

function giveData(item) {
    $("list").data = item
}