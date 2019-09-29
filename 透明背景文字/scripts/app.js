
var color = require('scripts/color')

sliderValue = $cache.get("sliderValue");

textColor = $cache.get("textColor");

maxFontSize = 100

if (sliderValue == undefined) {
  sliderValue = 0.25
}

if (textColor == undefined) {
  textColor = "#000000"
}

labelFont = sliderValue * maxFontSize


module.exports.render = function render() {
  $ui.render({
    props: {
      title: "透明背景文字",
      navButtons: [
        {
          title: "保存",
          handler: function () {
            let view = $("view")
            $photo.save({
              data: view.snapshot.png,
              handler: function (success) {
                if (success) {
                  $ui.toast("图片已保存到相册");
                  $cache.set("sliderValue", $("slider").value);
                  $cache.set("textColor", $("label-textColor").textColor.hexCode);
                }
              }
            })
          }
        }
      ]
    },
    views: [{
      type: "scroll",
      layout: $layout.fill,
      views: [{
        type: "view",
        views: [{
          type: "text",
          props: {
            id: "text",
            bgcolor: $color("#f4f5fa"),
            radius: 5,
            accessoryView: {
              type: "view",
              props: {
                height: 44,
                bgcolor: $color("#d0d3d9")
              },
              views: [
                {
                  type: "button",
                  props: {
                    title: "清空输入内容",
                    id: "clearContent",
                    bgcolor: $color("#d0d3d9"),
                    titleColor: $color("black")
                  },
                  layout: function (make, view) {
                    make.top.bottom.equalTo(view.super)
                    make.left.inset(10)
                  },
                  events: {
                    tapped: function (sender) {
                      $("text").text = ""
                    }
                  }
                },
                {
                  type: "button",
                  props: {
                    title: "收起键盘",
                    bgcolor: $color("#d0d3d9"),
                    titleColor: $color("black")
                  },
                  layout: function (make, view) {
                    make.top.bottom.equalTo(view.super)
                    make.right.inset(10)
                    make.left.equalTo($("clearContent").right).offset(10)
                    make.width.equalTo($("clearContent"))
                  },
                  events: {
                    tapped: function (sender) {
                      $("text").blur()
                    }
                  }
                }
              ]
            }
          },
          layout: function (make, view) {
            make.left.inset(20)
            make.top.inset(20)
            make.height.equalTo(100)
          },
          events: {
            didChange: function (sender) {
              $("label-textColor").text = sender.text
            }
          }
        }, {
          type: "view",
          props: {
            borderWidth: 0.5,
            borderColor: $color("black"),
            radius: 15,
            id: "colorView",
            bgcolor: $color(textColor)
          }, views: [
            {
              type: "button",
              props: {
                bgcolor: $color("clear")
              },
              layout: $layout.fill, events: {
                tapped: function (sender) {
                  color.beginSelectedColor("label-textColor", "colorView")
                  $("text").blur()
                }
              }
            }
          ],
          layout: function (make, view) {
            make.centerY.equalTo($("text"))
            make.left.equalTo($("text").right).offset(20)
            make.right.inset(20)
            make.width.height.equalTo(30)
          }
        }, {
          type: "slider",
          props: {
            value: sliderValue,
            max: 1.0,
            min: 0.0,
            id: "slider"
          },
          layout: function (make, view) {
            make.top.equalTo($("text").bottom).offset(10)
            make.centerX.equalTo(view.super)
            make.left.inset(20)
            make.right.inset(20)
            make.height.equalTo(50)
          }, events: {
            changed: function (sender) {
              $("text").blur()
              let fontSize = maxFontSize * sender.value
              fontSize = fontSize < 1 ? 1 : fontSize
              $("label-textColor").font = $font(fontSize);
            }
          }
        }, {
          type: "view",
          props: {
            id: "view",
            bgcolor: $color("clear")
          }, views: [{
            type: "label",
            props: {
              id: "label-textColor",
              align: $align.center,
              bgcolor: $color("clear"),
              lines: 0,
              font: $font(labelFont),
              textColor: $color(textColor)
            },
            layout: function (make, view) {
              make.edges.equalTo($("view"))
            }
          }
          ],
          layout: function (make, view) {
            make.top.equalTo($("slider").bottom).offset(5)
            make.left.inset(20)
            make.right.inset(20)
            make.height.equalTo($("view").width)
            make.bottom.equalTo(view.super).offset(-20)
          }
        },
        {
          type: "view",
          props: {
            borderWidth: 0.5,
            borderColor: $color("black"),
            radius: 5,
            id: "viewBorder"
          },
          layout: function (make, view) {
            make.edges.equalTo($("view"))
          }
        }],
        layout: function (make, view) {
          make.width.equalTo(view.super)
          make.edges.equalTo(view.super)
        }
      }], events: {
        didScroll: function (sender) {
          $("text").blur()
        }
      }
    }]
  });
}


