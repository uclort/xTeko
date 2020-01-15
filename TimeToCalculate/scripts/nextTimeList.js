module.exports.render = function render(startDate) {
  $ui.push({
    props: {
      title: "下一日期预计"
    },
    views: [{
      type: "list",
      props: {
        id: "",
        rowHeight: 60,
        data: getDataGroup(startDate),
        template: {
          props: {
            bgcolor: $color("clear")
          },
          views: [
            {
              type: "label",
              props: {
                id: "day",
                font: $font(16),
                textColor: $color("black"),
              },
              layout: function (make, view) {
                make.left.inset(20)
                make.centerY.equalTo(view.super.centerY)
              }
            },
            {
              type: "label",
              props: {
                id: "date",
                font: $font(16)
              },
              layout: function (make, view) {
                make.right.inset(20)
                make.centerY.equalTo(view.super.centerY)
              }
            }
          ]
        }
      },
      layout: $layout.fill
    }]
  });
}

function getDataGroup(startDate) {
  var dataGroup = []
  for (var i = 20; i <= 40; i++) {
    let date = new Date(startDate)
    date.setDate(date.getDate() + i)
    let month = date.getMonth() + 1
    if (month > 11) month == 1
    let info = {
      day: { text: `${i} 天后` },
      date: { text: `${date.getFullYear()} 年 ${month} 月 ${date.getDate()} 日` }
    }
    dataGroup.push(info)
  }
  return dataGroup
}