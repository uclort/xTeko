
var addColor = require('./main')

let colorGroup = [
  "#000000",
  "#ffffff",
  "#fedfe1",
  "#cb1b45",
  "#f17c67",
  "#b55d4c",
  "#a0674b",
  "#233714",
  "#6b591d",
  "#efcfb6",
  "#6d0c74",
  "#33ff00",
  "#3333ff",
  "#ffff00",
  "#ffd700",
  "#ffa500",
  "#ff0000",
  "#d3d3d3"
]

module.exports = {
  beginSelectedColor: beginSelectedColor
}

Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

function beginSelectedColor(id) {
  $ui.push({
    props: {
      title: "选择颜色"
    },
    views: [{
      type: "matrix",
      props: {
        id: "",
        columns: 4,
        itemHeight: 88,
        spacing: 5,
        template: {
          props: {},
          views: [
            {
              type: "label",
              props: {
                id: "label-color",
                font: $font(15),
                radius: 5,
                align: $align.center
              },
              layout: $layout.fill
            }
          ]
        }
      },
      layout: $layout.fill,
      events: {
        didSelect: function (sender, indexPath, data) {
          let colorHex = data["label-color"].text
          if (colorHex == "+") {
            addColor.beginAddCustomColor(settingColor)
          } else {
            id(colorHex)
            $ui.pop()
          }

        }, didLongPress: function (sender, indexPath, data) {
          var handlerGroup = ["复制色值", "删除色值"]
          let colorHex = data["label-color"].text
          if (colorGroup.indexOf(colorHex) > -1) {
            handlerGroup.remove("删除色值")
          }
          $ui.menu({
            items: handlerGroup,
            handler: function (title, idx) {
              if (idx == 0) {
                $clipboard.text = colorHex
              } else if (idx == 1) {
                $ui.alert({
                  title: "是否删除这个自定义颜色？",
                  message: "删除后不可恢复，只能自行添加。",
                  actions: [
                    {
                      title: "删除",
                      handler: function () {
                        let customizeColor = $cache.get("customizeColor");
                        $console.info(customizeColor);
                        $console.info(colorHex);
                        customizeColor.remove(colorHex);
                        customizeColor.remove(colorHex.toUpperCase());
                        $cache.set("customizeColor", customizeColor);
                        settingColor()
                      }
                    },
                    {
                      title: "Cancel",
                      handler: function () {

                      }
                    }
                  ]
                })
              }
            },
            finished: function (cancelled) {

            }
          })

        }
      }
    }]
  });
  settingColor()
}

function settingColor() {

  let customizeColor = $cache.get("customizeColor");
  if (!customizeColor) {
    customizeColor = colorGroup
    $cache.set("customizeColor", customizeColor);
  }

  customizeColor.push("+")

  let colorGroupData = []
  for (let i = 0, len = customizeColor.length - 1; i <= len; i++) {
    let colorHexcode = customizeColor[i]
    let colorItem = colorHexcode
    let textColor = $color("lightGray")
    let borderColor = textColor
    let borderWidth = 0
    if (colorItem == "+") {
      // textColor = $color("lightGray");
      borderColor = textColor
      borderWidth = 0.5
      colorHexcode = "#ffffff"
    }
    colorItem = {
      "label-color": {
        bgcolor: $color(colorHexcode),
        text: colorItem.toLowerCase(),
        textColor: textColor,
        borderColor: borderColor,
        borderWidth: borderWidth
      }
    }
    colorGroupData.push(colorItem)
  }
  $("matrix").data = colorGroupData
}

