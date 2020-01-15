let add = require('./addTimeItem')
let tool = require('./tool')
let preview = require('./preview')
let cellLeftRightSpacing = 10
let celltopBottomSpacing = 10

var cellHeight = $device.isIpadPro ? 130.0 : 110.0
var contentInset = ($app.env == $env.today) ? $insets(0, 0, 0, 0) : $insets(5, 0, 0, 0)

var listReorder = false
var sortType = $cache.get("sort");
if (sortType == undefined) {
  sortType = 1
  listReorder = true
  let dataGroup = tool.getListData()
  for (var i = 0, len = dataGroup.length; i < len; i++) {
    let item = dataGroup[i]
    tool.changeItemSort(i, item.listID)
  }
} else if (sortType == 1) {
  listReorder = true
} else if (sortType == 2) {
  listReorder = false
}

module.exports.render = function render() {
  $ui.push({
    props: {
      title: "备份"
    },
    views: [{
      type: "backlist",
      props: {
        id: "",
        data: tool.getBackListData(),
        separatorHidden: true,
        rowHeight: cellHeight,
        contentInset: contentInset,
        reorder: (($app.env == $env.today) ? false : listReorder),
        template: {
          props: {
            bgcolor: $color("clear")
          },
          views: [
            {
              type: "view",
              props: {
                id: "backimageView",
                bgcolor: $color("white"),
                radius: 5,
              },
              views: [{
                type: "image",
                props: {
                  id: "backlistImage",
                  contentMode: $contentMode.scaleAspectFill,
                  radius: 5,
                  // borderWidth: 0.5,
                  // borderColor: $color("lightGray")
                },
                layout: function (make, view) {
                  make.left.inset(15)
                  make.top.bottom.inset(10)
                  make.width.equalTo(60)
                },
              }, {
                type: "view",
                props: {
                  radius: 5,
                  borderWidth: 0.5,
                  borderColor: $color("lightGray"),
                  userInteractionEnabled: false
                },
                layout: function (make, view) {
                  make.center.equalTo($("backlistImage"))
                  make.width.equalTo($("backlistImage")).offset(3)
                  make.height.equalTo($("backlistImage")).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "backlistName",
                  font: $font(20)
                },
                layout: function (make, view) {
                  make.left.equalTo($("backlistImage").right).offset(10)
                  make.bottom.equalTo($("backlistImage").centerY).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "backlistDescription",
                  textColor: $color("lightGray"),
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.left.equalTo($("backlistImage").right).offset(10)
                  make.top.equalTo($("backlistName").bottom).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "backlistUnit",
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.right.inset(15)
                  make.centerY.equalTo(view.super)
                },
              },
              {
                type: "label",
                props: {
                  id: "backlistTime",
                  font: $font(30)
                },
                layout: function (make, view) {
                  make.right.equalTo($("listUnit").left)
                  make.bottom.equalTo($("listUnit")).offset(5)
                },
              }, {
                type: "label",
                props: {
                  id: "backtype",
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.right.equalTo($("backlistTime").left)
                  make.bottom.equalTo($("backlistUnit"))
                },
              }],
              layout: function (make, view) {
                make.left.right.inset(cellLeftRightSpacing)
                make.top.bottom.inset(celltopBottomSpacing)
              },
              events: {
                ready: function (sender) {
                  var layer = sender.runtimeValue().invoke("layer")
                  layer.invoke("setShadowOffset", $size(0, 0))
                  layer.invoke("setShadowColor", $color("black").runtimeValue().invoke("CGColor"))
                  layer.invoke("setShadowOpacity", 0.1)
                  layer.invoke("setShadowRadius", 5)
                  layer.invoke("setMasksToBounds", false)
                }
              }
            },
            {
              type: "view",
              props: {
                id: "backnoImageView",
                bgcolor: $color("white"),
                radius: 5,
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "backnoListName",
                    textColor: $color("balck"),
                    font: $font(20)
                  },
                  layout: function (make, view) {
                    make.left.inset(15)
                    make.bottom.equalTo(view.super.centerY).offset(3)
                  },
                },
                {
                  type: "label",
                  props: {
                    id: "backnoListDescription",
                    textColor: $color("lightGray"),
                    font: $font(12)
                  },
                  layout: function (make, view) {
                    make.left.equalTo($("backnoListName"))
                    make.top.equalTo($("backnoListName").bottom).offset(3)
                  },
                },
                {
                  type: "label",
                  props: {
                    id: "backnoListUnit",
                    font: $font(12)
                  },
                  layout: function (make, view) {
                    make.right.inset(15)
                    make.centerY.equalTo(view.super)
                  },
                },
                {
                  type: "label",
                  props: {
                    id: "backnoListTime",
                    font: $font(30)
                  },
                  layout: function (make, view) {
                    make.right.equalTo($("backnoListUnit").left)
                    make.bottom.equalTo($("backnoListUnit")).offset(5)
                  },
                }, {
                  type: "label",
                  props: {
                    id: "backnoType",
                    font: $font(12)
                  },
                  layout: function (make, view) {
                    make.right.equalTo($("backnoListTime").left)
                    make.bottom.equalTo($("backnoListUnit"))
                  },
                }],
              layout: function (make, view) {
                make.left.right.inset(cellLeftRightSpacing)
                make.top.bottom.inset(celltopBottomSpacing)
              },
              events: {
                ready: function (sender) {
                  var layer = sender.runtimeValue().invoke("layer")
                  layer.invoke("setShadowOffset", $size(0, 0))
                  layer.invoke("setShadowColor", $color("black").runtimeValue().invoke("CGColor"))
                  layer.invoke("setShadowOpacity", 0.2)
                  layer.invoke("setShadowRadius", 10)
                  layer.invoke("setMasksToBounds", false)
                }
              }
            }
          ]
        }
      },
      layout: $layout.fill,
      events: {
        didSelect: function (sender, indexPath, data) {
          if (data.customImage == 1) {
            items.push("查看大图")
          }
          if (items.length == 0) {
            return
          }
          $ui.menu({
            items: items,
            handler: function (title, idx) {
              preview.beginPreview(data.bigImage)
            },
            finished: function (cancelled) {

            }
          })
        }
      }
    }]
  });
}

function updateList() {
  $("list").data = tool.getListData()
}