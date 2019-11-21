var tool = require('./tool')
var color = require('./color')

var time = ""

var customImage = 0

var selectedImage = undefined

module.exports.addItem = function addItem(detailData, updateList) {
  var navButtonTitle = "添加"
  var isChange = false
  if (detailData != undefined) {
    navButtonTitle = "修改"
    isChange = true
  }
  $ui.push({
    props: {
      title: "添加记录",
      navButtons: [
        {
          title: navButtonTitle,
          handler: function () {
            blurAll()
            var name = $("name").text
            var description = $("description").text

            if (name.length == 0) {
              $ui.toast("请输入记录名称");
              return
            }
            if (description.length == 0) {
              $ui.toast("请输入记录描述");
              return
            }
            if (time.length == 0) {
              $ui.toast("请选择开始日期");
              return
            }
            var imageData = $("image").image.jpg(0.8)
            if (selectedImage != undefined) {
              imageData = selectedImage.jpg(0.8)
            }
            var date = new Date()
            var id = date.getTime()
            if (isChange) {
              id = detailData.listID
            }
            var cycleType = ""
            if ($("leftSwitch").on == true) {
              cycleType = "month"
            } else if ($("rightSwitch").on == true) {
              cycleType = "year"
            }

            var data = {
              "id": `${id}`,
              "name": name,
              "description": description,
              "time": `${time}`,
              "image": imageData,
              "type": 1,
              "customImage": customImage,
              "bgColor": $("bgColor").bgcolor.hexCode,
              "descriptionColor": $("descriptionTextColor").bgcolor.hexCode,
              "nameColor": $("nameTextColor").bgcolor.hexCode,
              "dateColor": $("dataTextColor").bgcolor.hexCode,
              "dateUnitColor": $("dateUnitTextColor").bgcolor.hexCode,
              "dayNumber": `${new Date(parseInt(time)).getDate()}`,
              "cycleType": cycleType
            }

            if (isChange) {// 修改状态
              tool.changeItem(data)
            } else { // 添加状态
              tool.addItem(data)
            }
            updateList()
            $ui.pop();
          }
        }
      ]
    },
    views: [
      {
        type: "view",
        props: {

        },
        views: [

          {
            type: "view",
            props: {
              id: "previewImageView",
              bgcolor: $color("white"),
              radius: 5,
              hidden: true
            },
            views: [{
              type: "image",
              props: {
                id: "previewListImage",
                contentMode: $contentMode.scaleAspectFill,
                radius: 5,
                // borderWidth: 0.5,
                // borderColor: $color("lightGray")
              },
              layout: function (make, view) {
                make.left.inset(15)
                make.top.bottom.inset(10)
                make.size.equalTo($size(60, 60))
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
                make.center.equalTo($("previewListImage"))
                make.width.equalTo($("previewListImage")).offset(3)
                make.height.equalTo($("previewListImage")).offset(3)
              },
            },
            {
              type: "label",
              props: {
                id: "previewListName",
                font: $font(20)
              },
              layout: function (make, view) {
                make.left.equalTo($("previewListImage").right).offset(10)
                make.bottom.equalTo($("previewListImage").centerY).offset(3)
              },
            },
            {
              type: "label",
              props: {
                id: "previewListDescription",
                textColor: $color("lightGray"),
                font: $font(12)
              },
              layout: function (make, view) {
                make.left.equalTo($("previewListImage").right).offset(10)
                make.top.equalTo($("previewListName").bottom).offset(3)
              },
            },
            {
              type: "label",
              props: {
                id: "previewListUnit",
                font: $font(12),
                textColor: $color("#000000")
              },
              layout: function (make, view) {
                make.right.inset(15)
                make.centerY.equalTo(view.super)
              },
            },
            {
              type: "label",
              props: {
                id: "previewListTime",
                font: $font(30),
                textColor: $color("#000000")
              },
              layout: function (make, view) {
                make.right.equalTo($("previewListUnit").left)
                make.bottom.equalTo($("previewListUnit")).offset(5)
              },
            }, {
              type: "label",
              props: {
                id: "previewType",
                font: $font(12)
              },
              layout: function (make, view) {
                make.right.equalTo($("previewListTime").left)
                make.bottom.equalTo($("previewListUnit"))
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
              id: "previewNoImageView",
              bgcolor: $color("white"),
              radius: 5,
            },
            views: [
              {
                type: "label",
                props: {
                  id: "previewNoListName",
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
                  id: "previewNoListDescription",
                  textColor: $color("lightGray"),
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.left.equalTo($("previewNoListName"))
                  make.top.equalTo($("previewNoListName").bottom).offset(3)
                },
              },
              {
                type: "label",
                props: {
                  id: "previewNoListUnit",
                  font: $font(12),
                  textColor: $color("#000000")
                },
                layout: function (make, view) {
                  make.right.inset(15)
                  make.centerY.equalTo(view.super)
                },
              },
              {
                type: "label",
                props: {
                  id: "previewNoListTime",
                  font: $font(30),
                  textColor: $color("#000000")
                },
                layout: function (make, view) {
                  make.right.equalTo($("previewNoListUnit").left)
                  make.bottom.equalTo($("previewNoListUnit")).offset(5)
                },
              }, {
                type: "label",
                props: {
                  id: "previewNoType",
                  font: $font(12)
                },
                layout: function (make, view) {
                  make.right.equalTo($("previewNoListTime").left)
                  make.bottom.equalTo($("previewNoListUnit"))
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
          }

        ],
        layout: function (make, view) {
          make.left.top.right.equalTo(view.super)
          make.height.equalTo(100)
        }
      },
      {
        type: "scroll",
        props: {
          keyboardDismissMode: 1
        },
        views: [
          {
            type: "view",
            props: {

            },
            views: [
              {
                type: "image",
                props: {
                  icon: $icon("099", $color("black"), $size(100, 100)),
                  contentMode: $contentMode.scaleAspectFill,
                  radius: 5,
                  // borderWidth: 0.5,
                  // borderColor: $color("lightGray")
                },
                layout: function (make, view) {
                  make.top.inset(10)
                  make.centerX.equalTo(view.super)
                  make.size.equalTo($size(100, 100))
                },
                events: {
                  tapped: function (sender) {
                    $photo.prompt({
                      handler: function (resp) {
                        var image = resp.image
                        if (image) {
                          selectedImage = image.jpg(0.8).image
                          var resizedImage = selectedImage.resized($size(200, 200 * (image.size.height / image.size.width)))
                          $("image").image = resizedImage
                          $("previewListImage").image = resizedImage
                          customImage = 1
                          $("previewNoImageView").hidden = true
                          $("previewImageView").hidden = false
                        }
                      }
                    })
                  }, longPressed: function (info) {
                    if (customImage == 0) {
                      return
                    }
                    $ui.menu({
                      items: ["删除图片"],
                      handler: function (title, idx) {
                        customImage = 0
                        selectedImage = undefined
                        $("image").icon = $icon("099", $color("black"), $size(100, 100))
                        $("previewNoImageView").hidden = false
                        $("previewImageView").hidden = true
                      },
                      finished: function (cancelled) {

                      }
                    })
                  }
                }
              }, {
                type: "view",
                props: {
                  radius: 5,
                  borderWidth: 0.5,
                  borderColor: $color("lightGray"),
                  userInteractionEnabled: false
                },
                layout: function (make, view) {
                  make.center.equalTo($("image"))
                  make.width.equalTo($("image")).offset(3)
                  make.height.equalTo($("image")).offset(3)
                },
              },
              {
                type: "input",
                props: {
                  darkKeyboard: true,
                  placeholder: "记录名称",
                  id: "name"
                },
                layout: function (make, view) {
                  make.left.right.inset(20)
                  make.top.equalTo($("image").bottom).offset(20)
                  make.height.equalTo(50)
                },
                events: {
                  returned: function (sender) {
                    sender.blur()
                  },
                  changed: function (sender) {
                    $("previewListName").text = sender.text
                    $("previewNoListName").text = sender.text
                  }
                }
              },
              {
                type: "input",
                props: {
                  darkKeyboard: true,
                  placeholder: "记录描述",
                  id: "description"
                },
                layout: function (make, view) {
                  make.left.right.inset(20)
                  make.top.equalTo($("name").bottom).offset(20)
                  make.height.equalTo(50)
                },
                events: {
                  returned: function (sender) {
                    sender.blur()
                  },
                  changed: function (sender) {
                    $("previewListDescription").text = sender.text
                    $("previewNoListDescription").text = sender.text
                  }
                }
              },
              {
                type: "button",
                props: {
                  title: "选择日期"
                },
                layout: function (make, view) {
                  make.left.right.inset(20)
                  make.top.equalTo($("description").bottom).offset(20)
                  make.height.equalTo(50)
                },
                events: {
                  tapped: function (sender) {
                    blurAll()
                    var selectedDate = new Date()
                    if (time != undefined || time != "") {
                      selectedDate = new Date(parseInt(time))
                    } else if (detailData != undefined) {
                      selectedDate = new Date(parseInt(detailData.time))
                    }
                    pickdate(selectedDate)
                  }
                }
              },
              {
                type: "view",
                props: {
                  id: "colorView"
                },
                views: [
                  {
                    type: "view",
                    props: {
                      id: "colorOneView"
                    },
                    views: [
                      {
                        type: "button",
                        props: {
                          id: "bgColor",
                          radius: 15,
                          borderWidth: 1,
                          borderColor: $color("lightGray"),
                          bgcolor: $color("#FFFFFF")
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.bottom.equalTo(view.super.centerY)
                          make.size.equalTo($size(30, 30))
                        },
                        events: {
                          tapped: function (sender) {
                            color.beginSelectedColor(colorHasBeenSelected_bgcolor)
                          }
                        }
                      },
                      {
                        type: "label",
                        props: {
                          text: "背景",
                          font: $font(12)
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.top.equalTo(view.super.centerY).offset(5)
                        }
                      }
                    ],
                    layout: function (make, view) {
                      make.left.top.bottom.equalTo(view.super)
                    }
                  },
                  {
                    type: "view",
                    props: {
                      id: "colorTwoView"
                    },
                    views: [
                      {
                        type: "button",
                        props: {
                          id: "nameTextColor",
                          radius: 15,
                          borderWidth: 1,
                          borderColor: $color("lightGray"),
                          bgcolor: $color("#000000")
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.bottom.equalTo(view.super.centerY)
                          make.size.equalTo($size(30, 30))
                        },
                        events: {
                          tapped: function (sender) {
                            color.beginSelectedColor(colorHasBeenSelected_nameTextColor)
                          }
                        }
                      },
                      {
                        type: "label",
                        props: {
                          text: "名称",
                          font: $font(12)
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.top.equalTo(view.super.centerY).offset(5)
                        }
                      }
                    ],
                    layout: function (make, view) {
                      make.top.bottom.equalTo(view.super)
                      make.left.equalTo($("colorOneView").right)
                      make.width.equalTo($("colorOneView"))
                    }
                  },
                  {
                    type: "view",
                    props: {
                      id: "colorThreeView"
                    },
                    views: [
                      {
                        type: "button",
                        props: {
                          id: "descriptionTextColor",
                          radius: 15,
                          borderWidth: 1,
                          borderColor: $color("lightGray"),
                          bgcolor: $color("#d3d3d3")
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.bottom.equalTo(view.super.centerY)
                          make.size.equalTo($size(30, 30))
                        },
                        events: {
                          tapped: function (sender) {
                            color.beginSelectedColor(colorHasBeenSelected_descriptionTextColor)
                          }
                        }
                      },
                      {
                        type: "label",
                        props: {
                          text: "描述",
                          font: $font(12)
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.top.equalTo(view.super.centerY).offset(5)
                        }
                      }
                    ],
                    layout: function (make, view) {
                      make.top.bottom.equalTo(view.super)
                      make.left.equalTo($("colorTwoView").right)
                      make.width.equalTo($("colorTwoView"))
                    }
                  },
                  {
                    type: "view",
                    props: {
                      id: "colorFourView"
                    },
                    views: [
                      {
                        type: "button",
                        props: {
                          id: "dataTextColor",
                          radius: 15,
                          borderWidth: 1,
                          borderColor: $color("lightGray"),
                          bgcolor: $color("#000000")
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.bottom.equalTo(view.super.centerY)
                          make.size.equalTo($size(30, 30))
                        },
                        events: {
                          tapped: function (sender) {
                            color.beginSelectedColor(colorHasBeenSelected_dateTextColor)
                          }
                        }
                      },
                      {
                        type: "label",
                        props: {
                          text: "日期",
                          font: $font(12)
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.top.equalTo(view.super.centerY).offset(5)
                        }
                      }
                    ],
                    layout: function (make, view) {
                      make.top.bottom.equalTo(view.super)
                      make.left.equalTo($("colorThreeView").right)
                      make.width.equalTo($("colorThreeView"))
                    }
                  },
                  {
                    type: "view",
                    props: {
                      id: "colorFiveView"
                    },
                    views: [
                      {
                        type: "button",
                        props: {
                          id: "dateUnitTextColor",
                          radius: 15,
                          borderWidth: 1,
                          borderColor: $color("lightGray"),
                          bgcolor: $color("#000000")
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.bottom.equalTo(view.super.centerY)
                          make.size.equalTo($size(30, 30))
                        },
                        events: {
                          tapped: function (sender) {
                            color.beginSelectedColor(colorHasBeenSelected_dateUnitTextColor)
                          }
                        }
                      },
                      {
                        type: "label",
                        props: {
                          text: "单位",
                          font: $font(12)
                        },
                        layout: function (make, view) {
                          make.centerX.equalTo(view.super)
                          make.top.equalTo(view.super.centerY).offset(5)
                        }
                      }
                    ],
                    layout: function (make, view) {
                      make.right.top.bottom.equalTo(view.super)
                      make.left.equalTo($("colorFourView").right)
                      make.width.equalTo($("colorFourView"))
                    }
                  }
                ],
                layout: function (make, view) {
                  make.left.right.inset(20)
                  make.top.equalTo($("button").bottom).offset(20)
                  make.height.equalTo(100)
                }
              }, {
                type: "view",
                props: {
                  id: "leftSwitchView"
                },
                views: [
                  {
                    type: "switch",
                    props: {
                      on: false,
                      id: "leftSwitch"
                    },
                    layout: function (make, view) {
                      make.centerX.equalTo(view.super)
                      make.top.equalTo(view.super).offset(5)
                    },
                    events: {
                      changed: function (sender) {
                        if (sender.on == true) {
                          $("rightSwitch").on = false
                          settingPre(true, false, time)
                        } else {
                          settingPre(false, $("rightSwitch").on, time)
                        }
                      }
                    }
                  }, {
                    type: "label",
                    props: {
                      text: "月循环",
                      font: $font(12)
                    },
                    layout: function (make, view) {
                      make.centerX.equalTo(view.super)
                      make.top.equalTo($("leftSwitch").bottom).offset(5)
                    }
                  }
                ],
                layout: function (make, view) {
                  make.top.equalTo($("colorView").bottom)
                  make.left.equalTo($("colorView"))
                  make.height.equalTo(100)
                  make.bottom.equalTo(view.super)
                }
              }, {
                type: "view",
                props: {
                  id: "rightSwitchView"
                },
                views: [
                  {
                    type: "switch",
                    props: {
                      on: false,
                      id: "rightSwitch"
                    },
                    layout: function (make, view) {
                      make.centerX.equalTo(view.super)
                      make.top.equalTo(view.super).offset(5)
                    },
                    events: {
                      changed: function (sender) {
                        if (sender.on == true) {
                          $("leftSwitch").on = false
                          settingPre($("leftSwitch").on, true, time)
                        } else {
                          settingPre($("leftSwitch").on, false, time)
                        }
                      }
                    }
                  }, {
                    type: "label",
                    props: {
                      text: "年循环",
                      font: $font(12)
                    },
                    layout: function (make, view) {
                      make.centerX.equalTo(view.super)
                      make.top.equalTo($("rightSwitch").bottom).offset(5)
                    }
                  }
                ],
                layout: function (make, view) {
                  make.top.equalTo($("leftSwitchView"))
                  make.left.equalTo($("leftSwitchView").right)
                  make.width.equalTo($("leftSwitchView"))
                  make.height.equalTo(100)
                  make.right.equalTo($("colorView"))
                }
              }
            ],
            layout: function (make, view) {
              make.edges.equalTo(view.super)
              make.width.equalTo(view.super)
            }
          }
        ],
        layout: function (make, view) {
          make.top.equalTo(100)
          make.left.right.bottom.equalTo(view.super)
        }
      }
    ]
  });
  if (detailData != undefined) {
    updateAddItemView(detailData)
  }
}

function pickdate(date) {
  $pick.date({
    props: {
      mode: 1,
      min: new Date("1700/1/1"),
      max: new Date("2199/12/31"),
      date: date
    },
    handler: function (sender) {
      var year = sender.getFullYear()
      var month = sender.getMonth() + 1
      var day = sender.getDate()
      if (month == 13) {
        month = 12
      }
      sender.setHours(0)
      sender.setMinutes(0)
      sender.setSeconds(0)
      sender.setMilliseconds(0)
      time = sender.getTime()
      $("button").title = `${year} 年 ${month} 月 ${day} 日`
      settingPre($("leftSwitch").on, $("rightSwitch").on, time)
    }
  })
}

function blurAll() {
  $("name").blur()
  $("description").blur()
}

function colorHasBeenSelected_bgcolor(colorHexCode) {
  var color = $color(colorHexCode)
  $("previewImageView").bgcolor = color
  $("previewNoImageView").bgcolor = color
  $("bgColor").bgcolor = color
}
function colorHasBeenSelected_nameTextColor(colorHexCode) {
  var color = $color(colorHexCode)
  $("previewListName").textColor = color
  $("previewNoListName").textColor = color
  $("nameTextColor").bgcolor = color
}
function colorHasBeenSelected_descriptionTextColor(colorHexCode) {
  var color = $color(colorHexCode)
  $("previewListDescription").textColor = color
  $("previewNoListDescription").textColor = color
  $("descriptionTextColor").bgcolor = color
}
function colorHasBeenSelected_dateTextColor(colorHexCode) {
  var color = $color(colorHexCode)
  $("previewListTime").textColor = color
  $("previewNoListTime").textColor = color
  $("dataTextColor").bgcolor = color
}
function colorHasBeenSelected_dateUnitTextColor(colorHexCode) {
  var color = $color(colorHexCode)
  $("previewListUnit").textColor = color
  $("previewNoListUnit").textColor = color
  $("previewType").textColor = color
  $("previewNoType").textColor = color
  $("dateUnitTextColor").bgcolor = color
}

function updateAddItemView(detailData) {

  $("name").text = detailData.listName.text
  $("description").text = detailData.listDescription.text

  $("previewListName").text = detailData.listName.text
  $("previewListName").textColor = detailData.listName.textColor

  $("previewNoListName").text = detailData.noListName.text
  $("previewNoListName").textColor = detailData.noListName.textColor

  $("previewListDescription").text = detailData.listDescription.text
  $("previewListDescription").textColor = detailData.listDescription.textColor

  $("previewNoListDescription").text = detailData.noListDescription.text
  $("previewNoListDescription").textColor = detailData.noListDescription.textColor

  $("previewListTime").text = detailData.listTime.text
  $("previewListTime").textColor = detailData.listTime.textColor

  $("previewNoListTime").text = detailData.noListTime.text
  $("previewNoListTime").textColor = detailData.noListTime.textColor

  $("previewListUnit").text = detailData.listUnit.text
  $("previewListUnit").textColor = detailData.listUnit.textColor

  $("previewNoListUnit").text = detailData.noListUnit.text
  $("previewNoListUnit").textColor = detailData.noListUnit.textColor

  $("previewType").text = detailData.type.text
  $("previewType").textColor = detailData.type.textColor

  $("previewNoType").text = detailData.type.text
  $("previewNoType").textColor = detailData.type.textColor

  $("previewImageView").bgcolor = detailData.imageView.bgcolor
  $("previewImageView").hidden = detailData.imageView.hidden

  $("previewNoImageView").bgcolor = detailData.noImageView.bgcolor
  $("previewNoImageView").hidden = detailData.noImageView.hidden

  $("previewListImage").image = detailData.listImage.data.image

  customImage = detailData.customImage
  time = detailData.time

  if (customImage == 1) {
    $("image").image = detailData.listImage.data.image
  }

  var date = new Date(parseInt(time))
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  if (month == 13) {
    month = 12
  }
  $("button").title = `${year} 年 ${month} 月 ${day} 日`

  $("bgColor").bgcolor = detailData.imageView.bgcolor
  $("nameTextColor").bgcolor = detailData.listName.textColor
  $("descriptionTextColor").bgcolor = detailData.listDescription.textColor
  $("dataTextColor").bgcolor = detailData.listTime.textColor
  $("dateUnitTextColor").bgcolor = detailData.listUnit.textColor

  if (detailData.cycleType == "month") {
    $("leftSwitch").on = true
  }
  if (detailData.cycleType == "year") {
    $("rightSwitch").on = true
  }
}

function settingPre(leftOn, rightOn, time) {
  if (time == undefined || time == "") return
  let diff = []
  if (leftOn == true) {
    diff = tool.calculateDateDifference(time, "month")
  } else if (rightOn == true) {
    diff = tool.calculateDateDifference(time, "year")
  } else {
    diff = tool.calculateDateDifference(time, "")
  }

  $("previewListTime").text = diff[0]

  $("previewNoListTime").text = diff[0]

  $("previewListUnit").text = diff[1]

  $("previewNoListUnit").text = diff[1]

  $("previewType").text = diff[2]

  $("previewNoType").text = diff[2]
}