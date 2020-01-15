var tool = require('./tool')
var next = require('./nextTimeList')



module.exports.render = function render() {
  $ui.render({
    props: {
      title: "记录",
      navButtons: [
        {
          title: "新增",
          symbol: "plus.circle", // SF symbols are supported
          handler: function () {
            pickdate(new Date(), 999)
          }
        }
      ]
    },
    views: [{
      type: "list",
      props: {
        id: "",
        rowHeight: 60,
        data: tool.getListData().reverse(),
        actions: [
          {
            title: "delete",
            color: $color("red"), // default to gray
            handler: function (sender, indexPath) {
              let data = tool.getListData().reverse()[indexPath.row]
              tool.deleteItem(data.id)
              $("list").data = tool.getListData().reverse()
            }
          }
        ],
        template: {
          props: {
            bgcolor: $color("clear")
          },
          views: [
            {
              type: "label",
              props: {
                id: "startDate",
                font: $font(20),
                textColor: $color("black"),
              },
              layout: function (make, view) {
                make.left.inset(20)
                make.bottom.equalTo(view.super.centerY)
              }
            },
            {
              type: "label",
              props: {
                id: "endDate",
                font: $font(12)
              },
              layout: function (make, view) {
                make.left.equalTo($("startDate"))
                make.top.equalTo(view.super.centerY)
              }
            },
            {
              type: "label",
              props: {
                id: "cycle",
              },
              layout: function (make, view) {
                make.right.inset(20)
                make.centerY.equalTo(view.super)
              }
            }
          ]
        }
      },
      layout: $layout.fill,
      events: {
        didLongPress: function (sender, indexPath, data) {
          pickdate(new Date(data.startDate.time), data.id)
        },
        didSelect: function (sender, indexPath, data) {
          next.render(data.startDate.time)
        }
      }
    }]
  });
}

function pickdate(date, changeID) {
  $pick.date({
    props: {
      mode: 1,
      min: new Date("1700/1/1"),
      max: new Date("2199/12/31"),
      date: date
    },
    handler: function (sender) {
      sender.setHours(0)
      sender.setMinutes(0)
      sender.setSeconds(0)
      sender.setMilliseconds(0)
      if (changeID != 999) {
        tool.changeItem(changeID, sender.getTime())
        $("list").data = tool.getListData().reverse()
      } else {
        saveItem(sender.getTime())
      }
      backup()
    }
  })
}

function saveItem(date) {
  tool.addItem(date)
  $("list").data = tool.getListData().reverse()
}

function backup() {
  if (!$drive.exists("TimeToCalculate")) {
    $drive.mkdir("TimeToCalculate")
  }
  var file = $file.read("shared://TimeToCalculate/timeList.db")
  var success = $drive.write({
    data: file,
    path: "TimeToCalculate/timeList.db"
  })
}