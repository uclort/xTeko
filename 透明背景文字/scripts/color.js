
var addColor = require('scripts/main')

module.exports = {
  beginSelectedColor: beginSelectedColor
}

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
                font: $font(30),
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
          $console.info(data);
          let colorHex = data["label-color"].text
          if (colorHex == "+") {
            addColor.beginAddCustomColor(settingColor)
          } else {
            $(id).textColor = $color(colorHex)
            $ui.pop()
          }

        }
      }
    }]
  });
  settingColor()
}

function settingColor() {
  $console.info("更新颜色");
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
    let textColor = $color("clear")
    let borderColor = textColor
    let borderWidth = 0
    if (colorItem == "+") {
      textColor = $color("lightGray");
      borderColor = textColor
      borderWidth = 0.5
      colorHexcode = "#ffffff"
    }
    colorItem = {
      "label-color": {
        bgcolor: $color(colorHexcode),
        text: colorItem,
        textColor: textColor,
        borderColor: borderColor,
        borderWidth: borderWidth
      }
    }
    colorGroupData.push(colorItem)
  }
  $("matrix").data = colorGroupData
}

