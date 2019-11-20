let add = require('./addTimeItem')
let tool = require('./tool')
let preview = require('./preview')

module.exports.render = function render() {
  $ui.render({
    props: {
      title: "记录",
      navButtons: [
        {
          icon: "102",
          handler: function () {
            $ui.menu({
              items: ["添加记录", "清空记录"],
              handler: function (title, idx) {
                if (idx == 0) {
                  add.addItem(undefined, updateList)
                } else {
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
        rowHeight: 100,
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
                  contentMode: $contentMode.scaleAspectFill
                },
                layout: function (make, view) {
                  make.left.inset(15)
                  make.top.bottom.inset(10)
                  make.width.equalTo(60)
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
                make.left.right.inset(20)
                make.top.bottom.inset(10)
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
                make.left.right.inset(20)
                make.top.bottom.inset(10)
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
          $console.info(data);
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
        }
      }
    }]
  });
}

function updateList() {
  $("list").data = tool.getListData()
}