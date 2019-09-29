$ui.render({
    props: {
        title: "Base64 编解码",
        bgcolor: $color("#f4f5fa")
    },
    views: [{
        type: "text",
        props: {
            id: "waitEncodeText",
            placeholder: "请输入待编码的内容",
            radius: 5,
            accessoryView: {
                type: "view",
                props: {
                  height: 44
                },
                views: [
                    {
                        type: "button",
                        props: {
                            id: "waitEncodeTextClear",
                            title: "清空待编码内容"
                        },
                        layout: function(make, view) {
                            make.left.inset(10)
                            make.top.bottom.inset(5)
                          },
                        events: {
                            tapped: function (sender) {
                                $("waitEncodeText").text = ""
                            }
                        }
                    },
                    {
                        type: "button",
                        props: {
                            id: "decodeButton",
                            title: "收起键盘"
                        },
                        layout: function(make, view) {
                            make.left.equalTo($("waitEncodeTextClear").right).offset(10)
                            make.right.inset(10)
                            make.width.equalTo($("waitEncodeTextClear"))
                            make.top.bottom.inset(5)
                          },
                        events: {
                            tapped: function (sender) {
                                $("waitEncodeText").blur()
                            }
                        }
                    }
                ]
              }
        },
        layout: function (make, view) {
            make.left.top.inset(10)
            make.height.equalTo(140)
        }
    }, {
        type: "button",
        props: {
            id: "waitEncodeTextPaste",
            title: "粘贴"
        },
        layout: function (make, view) {
            make.top.inset(10)
            make.left.equalTo($("waitEncodeText").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(67.5)
            make.width.equalTo(80)
        },
        events: {
            tapped: function(sender) {
                var text = $clipboard.text
                if (text) {
                    $("waitEncodeText").text = text
                    $("waitEncodeText").blur()
                    $("waitDecodeText").blur()
                }
            }
        }
    }, {
        type: "button",
        props: {
            id: "waitEncodeTextCopy",
            title: "复制"
        },
        layout: function (make, view) {
            make.top.equalTo($("waitEncodeTextPaste").bottom).offset(5)
            make.left.equalTo($("waitEncodeText").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(67.5)
            make.width.equalTo(80)
        }, events: {
            tapped: function(sender) {
                let text = $("waitEncodeText").text
                if (text) {
                    $clipboard.text = text
                    $("waitEncodeText").blur()
                    $("waitDecodeText").blur()
                }
            }
        }
    },{
        type: "text",
        props: {
            id: "waitDecodeText",
            placeholder: "请输入待解码的内容",
            radius: 5, 
            accessoryView: {
                type: "view",
                props: {
                  height: 44
                },
                views: [
                    {
                        type: "button",
                        props: {
                            id: "waitDecodeTextClear",
                            title: "清空待解码内容"
                        },
                        layout: function(make, view) {
                            make.left.inset(10)
                            make.top.bottom.inset(5)
                          },
                        events: {
                            tapped: function (sender) {
                                $("waitDecodeText").text = ""
                            }
                        }
                    },
                    {
                        type: "button",
                        props: {
                            id: "decodeButton",
                            title: "收起键盘"
                        },
                        layout: function(make, view) {
                            make.left.equalTo($("waitDecodeTextClear").right).offset(10)
                            make.right.inset(10)
                            make.width.equalTo($("waitDecodeTextClear"))
                            make.top.bottom.inset(5)
                          },
                        events: {
                            tapped: function (sender) {
                                $("waitDecodeText").blur()
                            }
                        }
                    }
                ]
              }
        },
        layout: function (make, view) {
            make.top.equalTo($("waitEncodeText").bottom).offset(10)
            make.left.inset(10)
            make.height.equalTo($("waitEncodeText"))
        }
    }, {
        type: "button",
        props: {
            id: "waitDecodeTextPaste",
            title: "粘贴"
        },
        layout: function (make, view) {
            make.top.equalTo($("waitDecodeText"))
            make.left.equalTo($("waitDecodeText").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(67.5)
            make.width.equalTo(80)
        },
        events: {
            tapped: function(sender) {
                var text = $clipboard.text
                if (text) {
                    $("waitDecodeText").text = text
                    $("waitEncodeText").blur()
                    $("waitDecodeText").blur()
                }
            }
        }
    }, {
        type: "button",
        props: {
            id: "waitDecodeTextCopy",
            title: "复制"
        },
        layout: function (make, view) {
            make.top.equalTo($("waitDecodeTextPaste").bottom).offset(5)
            make.left.equalTo($("waitDecodeText").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(67.5)
            make.width.equalTo(80)
        }, events: {
            tapped: function(sender) {
                let text = $("waitDecodeText").text
                if (text) {
                    $clipboard.text = text
                    $("waitEncodeText").blur()
                    $("waitDecodeText").blur()
                }
            }
        }
    }, {
        type: "button",
        props: {
            id: "encodeButton",
            title: "编码"
        },
        layout: function (make, view) {
            make.top.equalTo($("waitDecodeText").bottom).offset(10)
            make.left.inset(10)
            make.height.equalTo(40)
        },
        events: {
            tapped: function (sender) {
                encodeOrDecodeHandler(0)
                $("waitEncodeText").blur()
                $("waitDecodeText").blur()
            }
        }
    }, {
        type: "button",
        props: {
            id: "decodeButton",
            title: "解码"
        },
        layout: function (make, view) {
            make.top.equalTo($("encodeButton"))
            make.right.inset(10)
            make.left.equalTo($("encodeButton").right).offset(10)
            make.width.equalTo($("encodeButton"))
            make.height.equalTo(40)
        },
        events: {
            tapped: function (sender) {
                encodeOrDecodeHandler(1)
                $("waitEncodeText").blur()
                $("waitDecodeText").blur()
            }
        }
    }]
});

function encodeOrDecodeHandler(type) {
    if (type == 0) { // 编码
        var encodeText = $("waitEncodeText").text
        if (encodeText) {
            encodeText = $text.base64Encode(encodeText)
            $("waitDecodeText").text = encodeText
        }
    } else { // 解码
        var decodeText = $("waitDecodeText").text
        if (decodeText) {
            decodeText = $text.base64Decode(decodeText)
            $("waitEncodeText").text = decodeText
        }
    }
}

var text = $clipboard.text
if (text) {
    $ui.alert({
        title: "剪贴板内容",
        message: "是否提取剪贴板内容来进行编解码操作？",
        actions: [
            {
                title: "忽略",
                disabled: false, // Optional
                handler: function () {

                }
            },
            {
                title: "提取",
                handler: function () {
                    $ui.alert({
                        title: "操作选择",
                        message: "请选择您的操作，编码 or 解码",
                        actions: [
                            {
                                title: "编码",
                                disabled: false, // Optional
                                handler: function () {
                                    $("waitEncodeText").text = text
                                    encodeOrDecodeHandler(0)
                                }
                            },
                            {
                                title: "解码",
                                handler: function () {
                                    $("waitDecodeText").text = text
                                    encodeOrDecodeHandler(1)
                                }
                            }
                        ]
                    })
                }
            }
        ]
    })
}