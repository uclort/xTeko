
var color = require('scripts/color')


module.exports.render = function render() {
  $ui.render({
    props: {
      title: "透明背景文字"
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
            radius: 5
          },
          layout: function (make, view) {
            make.left.inset(10)
            make.top.inset(10)
            make.right.inset(10)
            make.height.equalTo(100)
          },
          events: {
            didChange: function (sender) {
              $("label-textColor").text = sender.text
            }
          }
        }, {
          type: "slider",
          props: {
            value: 0.25,
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
              let fontSize = 72 * sender.value
              fontSize = fontSize < 1 ? 1 : fontSize
              $("label").font = $font(fontSize);
            }
          }
        }, {
          type: "button",
          props: {
            title: "选择颜色",
            id: "colorselected",
          },
          layout: function (make, view) {
            make.top.equalTo($("slider").bottom).offset(5)
            make.left.inset(10)
            make.right.inset(10)
            make.height.equalTo(60)
          }, events: {
            tapped: function (sender) {
              color.beginSelectedColor("label-textColor")
            }
          }
        }, {
          type: "view",
          props: {
            id: "view",
            src: "assets/Transparentre.png",
            bgcolor: $color("clear")
          }, views: [
            {
              type: "image",
              props: {
                id: "image",
                src: "assets/Transparentre.png",
                bgcolor: $color("clear")
              },
              layout: function (make, view) {
                make.edges.equalTo($("view"))
              }
            }, {
              type: "label",
              props: {
                id: "label-textColor",
                align: $align.center,
                bgcolor: $color("clear"),
                lines: 0,
                font: $font(18)
              },
              layout: function (make, view) {
                make.edges.equalTo($("view"))
              }
            }
          ],
          layout: function (make, view) {
            make.top.equalTo($("colorselected").bottom).offset(5)
            make.left.inset(10)
            make.right.inset(10)
            make.height.equalTo($("view").width)
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
        },
        {
          type: "button",
          props: {
            title: "生成",
            id: "button"
          },
          layout: function (make, view) {
            make.top.equalTo($("view").bottom).offset(10)
            make.left.inset(10)
            make.right.inset(10)
            make.height.equalTo(60)
            make.bottom.equalTo(view.super).offset(-20)
          }, events: {
            tapped: function (sender) {
              let view = $("view")
              $quicklook.open({ image: view.snapshot })
            }
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


