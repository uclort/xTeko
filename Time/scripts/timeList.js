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
  $ui.render({
    props: {
      title: "记录",
      navButtons: [
        {
          icon: "102",
          handler: function () {
            $ui.menu({
              items: ["添加记录", "清空记录", "排序方式"],
              handler: function (title, idx) {
                if (idx == 0) {
                  add.addItem(undefined, updateList)
                } else if (idx == 1) {
                  $ui.alert({
                    title: "确定清空所有记录吗？",
                    message: "点击确定将清空所有已添加的记录，如果没有手动备份，将无法找回。",
                    actions: [
                      {
                        title: "清空",
                        handler: function () {
                          tool.clearList()
                          updateList()
                        }
                      },
                      {
                        title: "取消",
                        handler: function () {

                        }
                      }
                    ]
                  })
                } else if (idx == 2) { // 排序
                  var sortTitleGroup = []
                  if (sortType == 1) {
                    sortTitleGroup = ["默认排序✔️", "根据剩余天数排序"]
                  } else if (sortType == 2) {
                    sortTitleGroup = ["默认排序", "根据剩余天数排序✔️"]
                  }
                  $console.info("排序");
                  $ui.menu({
                    items: sortTitleGroup, // 1 , 2
                    handler: function (title, idx) {
                      if (idx == 0) {
                        $("list").reorder = true
                        $cache.set("sort", 1);
                        sortType = 1
                      } else if (idx == 1) {
                        $("list").reorder = false
                        $cache.set("sort", 2);
                        sortType = 2
                      }
                      updateList()
                    }
                  });
                }
              }
            })
          }
        }
      ]
    },
    views: [{
      type: "list",
      props: {
        id: "",
        data: tool.getListData(),
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
                id: "imageView",
                bgcolor: $color("white"),
                radius: 5,
              },
              views: [{
                type: "image",
                props: {
                  id: "listImage",
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
                  make.center.equalTo($("listImage"))
                  make.width.equalTo($("listImage")).offset(3)
                  make.height.equalTo($("listImage")).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "listName",
                  font: $font(20)
                },
                layout: function (make, view) {
                  make.left.equalTo($("listImage").right).offset(10)
                  make.bottom.equalTo($("listImage").centerY).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "listDescription",
                  textColor: $color("lightGray"),
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.left.equalTo($("listImage").right).offset(10)
                  make.top.equalTo($("listName").bottom).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "listUnit",
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
                  id: "listTime",
                  font: $font(30)
                },
                layout: function (make, view) {
                  make.right.equalTo($("listUnit").left)
                  make.bottom.equalTo($("listUnit")).offset(5)
                },
              }, {
                type: "label",
                props: {
                  id: "type",
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.right.equalTo($("listTime").left)
                  make.bottom.equalTo($("listUnit"))
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
                id: "noImageView",
                bgcolor: $color("white"),
                radius: 5,
              },
              views: [
                {
                  type: "label",
                  props: {
                    id: "noListName",
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
                    id: "noListDescription",
                    textColor: $color("lightGray"),
                    font: $font(12)
                  },
                  layout: function (make, view) {
                    make.left.equalTo($("noListName"))
                    make.top.equalTo($("noListName").bottom).offset(3)
                  },
                },
                {
                  type: "label",
                  props: {
                    id: "noListUnit",
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
                    id: "noListTime",
                    font: $font(30)
                  },
                  layout: function (make, view) {
                    make.right.equalTo($("noListUnit").left)
                    make.bottom.equalTo($("noListUnit")).offset(5)
                  },
                }, {
                  type: "label",
                  props: {
                    id: "noType",
                    font: $font(12)
                  },
                  layout: function (make, view) {
                    make.right.equalTo($("noListTime").left)
                    make.bottom.equalTo($("noListUnit"))
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
          // $console.info(data);
          var items = ["编辑", "删除"]
          if (data.customImage == 1) {
            items.push("查看大图")
          }
          $ui.menu({
            items: items,
            handler: function (title, idx) {
              if (idx == 0) {
                add.addItem(data, updateList)
              } else if (idx == 1) {
                tool.deleteItem(data.listID)
                updateList()
              } else {
                preview.beginPreview(data.bigImage)
              }
            },
            finished: function (cancelled) {

            }
          })
        }, reorderFinished: function (data) {
          for (var i = 0, len = data.length; i < len; i++) {
            let item = data[i]
            tool.changeItemSort(i, item.listID)
          }
        }
      }
    }]
  });
}

function updateList() {
  $("list").data = tool.getListData()
}