module.exports = {
  changeFont: changeFont
}


function changeFont(text, text2) {
  let group = settingData(text)
  let listData = group[0]
  let heightGroup = group[1]
  $ui.push({
    props: {
      title: "选择字体"
    },
    views: [{
      type: "list",
      props: {
        id: "list",
        data: listData,
        separatorHidden: true,
        // selectable: false,
        template: {
          props: {
          },
          views: [
            {
              type: "view",
              props: {
                id: "shadowView",
                bgcolor: $color("white"),
                radius: 5,
                clipsToBounds: false,
              },
              layout: function (make, view) {
                make.left.inset(20)
                make.right.inset(20)
                make.top.inset(10)
                make.bottom.inset(10)
              },
              events: {
                ready: function (sender) {
                  var layer = sender.runtimeValue().invoke("layer")
                  layer.invoke("setShadowOffset", $size(0, 0))
                  layer.invoke("setShadowColor", $color("black").runtimeValue().invoke("CGColor"))
                  layer.invoke("setShadowOpacity", 0.3)
                  layer.invoke("setShadowRadius", 8)
                  layer.invoke("setMasksToBounds", false)
                }
              }
            },
            {
              type: "label",
              props: {
                id: "label",
                textColor: $color("black"),
                align: $align.center,
                lines: 0
              },
              layout: function (make, view) {
                make.centerX.equalTo(view.super)
                make.centerY.equalTo(view.super)
              }
            }
          ]
        }
      },
      layout: $layout.fill,

      events: {
        rowHeight: function (sender, indexPath) {
          return heightGroup[indexPath.row] + 30
        },
        didSelect: function (sender, indexPath, data) {
          let fontName = data.label.font.runtimeValue().$fontName().jsValue()

          text2(fontName, data.label.font)
          $ui.pop()
        }
      }
    }]
  })
}

function settingData(text) {
  let listData = []
  let heightGroup = []
  let textString = text
  if (textString.length == 0) {
    textString = "我是文字\nWOSHIWENZI\nwoshiwenzi\n1234"
  }
  familyNames = $objc("UIFont").$familyNames().jsValue()
  for (familyName of familyNames) {
    for (fontName of $objc("UIFont").invoke("fontNamesForFamilyName", familyName).jsValue()) {
      let text = textString
      let font = $font(fontName, 18)
      var size = $text.sizeThatFits({
        text: text,
        width: 320,
        font: font,
        lineSpacing: 0
      })
      heightGroup.push(size.height)
      listData.push({ label: { text: text, font: font } })
    }
  }
  return [listData, heightGroup]
}
