searchDomainName = "https://zh.lmgtfy.com/?"
detailedParameter = ""

$ui.render({
    props: {
        title: "生成动图搜索教程",
        bgcolor: $color("#f4f5fa")
    },
    views: [{
        type: "text",
        props: {
            id: "textContent",
            // type: 10,
            placeholder: "搜索内容",
            accessoryView: {
                type: "view",
                props: {
                    height: 44,
                },
                views: [
                    {
                        type: "button",
                        props: {
                            title: "收起键盘",
                            bgcolor: $color("clear")
                        },
                        layout: $layout.fill,
                        events: {
                            tapped: function (sender) {
                                $("textContent").blur()
                            }
                        }
                    }
                ]
            }
        },
        layout: function (make, view) {
            make.top.inset(10)
            make.left.inset(10)
            make.right.inset(150)
            make.height.equalTo(100)
        },
        events: {
            returned: function (sender) {
                $("textContent").blur()
            }
        }
    }, {
        type: "button",
        props: {
            title: "清空"
        },
        layout: function (make, view) {
            make.top.equalTo($("textContent").top).offset(5)
            make.left.equalTo($("textContent").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $("textContent").blur()
                $("textContent").text = ""
                $("textResult").text = ""
            }
        }
    }, {
        type: "button",
        props: {
            title: "粘贴"
        },
        layout: function (make, view) {
            make.top.equalTo($("textContent").top).offset(10 + 85 * 0.5)
            make.left.equalTo($("textContent").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $("textContent").blur()
                if ($clipboard.text) {
                    $("textContent").text = $clipboard.text
                } else {
                    $ui.error("剪贴板没有内容")
                }
            }
        }
    }, {
        type: "text",
        props: {
            placeholder: "结果",
            id: "textResult",
            editable: false
        },
        layout: function (make, view) {
            make.top.equalTo($("textContent").bottom).offset(10)
            make.left.inset(10)
            make.right.inset(150)
            make.height.equalTo(100)
        },
        events: {

        }
    }, {
        type: "button",
        props: {
            title: "生成链接"
        },
        layout: function (make, view) {
            make.top.equalTo($("textResult").top).offset(5)
            make.left.equalTo($("textResult").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $("textContent").blur()
                var textString = ""
                textString = $("textContent").text
                if (textString.length == 0) {
                    $ui.error("请先粘贴或键入搜索内容");
                    return
                }
                generateSearchLinks($("textContent").text)
            }
        }
    }, {
        type: "button",
        props: {
            title: "复制结果",
            id: "button-copy"
        },
        layout: function (make, view) {
            make.top.equalTo($("textResult").top).offset(10 + 85 * 0.5)
            make.left.equalTo($("textResult").right).offset(10)
            make.right.inset(10)
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $("textContent").blur()
                $clipboard.text = $("textResult").text
                $ui.toast("url 复制成功");
            }
        }
    }, {
        type: "button",
        props: {
            title: "X",
            id: "button-x",
            hidden: true
        },
        layout: function (make, view) {
            make.top.equalTo($("textResult").bottom).offset(5)
            make.left.equalTo($("button-copy"))
            make.right.equalTo($("button-copy").centerX).offset(-2.5)
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $keyboard.delete()
            }
        }
    }, {
        type: "button",
        props: {
            title: "发送",
            id: "button-send",
            hidden: true
        },
        layout: function (make, view) {
            make.top.equalTo($("textResult").bottom).offset(5)
            make.right.equalTo($("button-copy"))
            make.left.equalTo($("button-copy").centerX).offset(2.5)
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $("textContent").blur()
                $keyboard.send()
                $delay(0.1, function () {
                    if ($keyboard.hasText) {
                        $keyboard.delete()
                    }
                })
            }
        }
    }, {
        type: "button",
        props: {
            title: "上屏",
            id: "button-screen",
            hidden: true
        },
        layout: function (make, view) {
            make.top.equalTo($("textResult").bottom).offset(5)
            make.right.equalTo($("button-x").left).offset(-2.5)
            make.width.equalTo($("button-x"))
            make.height.equalTo(85 * 0.5)
        },
        events: {
            tapped: function (sender) {
                $("textContent").blur()
                $keyboard.insert($("textResult").text)
            }
        }
    }, {
        type: "switch",
        props: {
            on: false
        },
        layout: function (make, view) {
            make.top.equalTo($("textResult").bottom).offset(5)
            make.left.inset(10)
        },
        events: {
            changed: function (sender) {
                if (sender.on) {
                    detailedParameter = "&iie=1"
                } else {
                    detailedParameter = ""
                }
            }
        }
    }, {
        type: "label",
        props: {
            text: "详细模式"
        },
        layout: function (make, view) {
            make.centerY.equalTo($("switch"))
            make.left.equalTo($("switch").right).offset(5)
        }
    }
        , {
        type: "button",
        props: {
            bgcolor: $color("clear")
        },
        layout: function (make, view) {
            make.right.equalTo($("textResult"))
            make.bottom.equalTo($("textResult"))
            make.width.equalTo(20)
            make.height.equalTo(20)
        },
        events: {
            tapped: function (sender) {
                if ($("textResult").text.indexOf("http://t.cn/") > -1) {
                    $ui.alert({
                        title: "",
                        message: "是否展开短链接？",
                        actions: [
                            {
                                title: "取消",
                                disabled: false, // Optional
                                handler: function () {

                                }
                            },
                            {
                                title: "展开",
                                handler: function () {
                                    $http.lengthen({
                                        url: $("textResult").text,
                                        handler: function (url) {
                                            $("textResult").text = url
                                        }
                                    })
                                }
                            }
                        ]
                    });
                } else {
                    $ui.alert({
                        title: "",
                        message: "是否还原短链接？",
                        actions: [
                            {
                                title: "取消",
                                disabled: false, // Optional
                                handler: function () {

                                }
                            },
                            {
                                title: "还原",
                                handler: function () {
                                    $http.shorten({
                                        url: $("textResult").text,
                                        handler: function (url) {
                                            $("textResult").text = url
                                        }
                                    })
                                }
                            }
                        ]
                    });
                }

            }
        }
    }
    ]
});

function generateSearchLinks(searchContent) {
    var urlParameter = ""
    $ui.menu({
        items: ["Google", "Baidu", "Bing", "YAHOO", "Aol.", "Ask", "DuckDuckGo"],
        handler: function (title, idx) {
            switch (idx) {
                case 0:
                    googleSearchType(searchContent)
                    return;
                case 1:
                    generateShortLinks("http://lmbtfy.cn/?q=" + searchContent)
                    return;
                case 2:
                    urlParameter = "s=b&q=" + searchContent
                    break;
                case 3:
                    urlParameter = "s=y&q=" + searchContent
                    break;
                case 4:
                    urlParameter = "s=a&q=" + searchContent
                    break;
                case 5:
                    urlParameter = "s=k&q=" + searchContent
                    break;
                case 6:
                    urlParameter = "s=d&q=" + searchContent
                    break;
            }
            urlParameter = searchDomainName + urlParameter
            generateShortLinks(urlParameter)
        }
    });
}

function googleSearchType(searchContent) {
    var urlParameter = ""
    $ui.menu({
        items: ["网络", "图像", "视频", "地图", "新闻", "购物", "图书", "金融", "学术"],
        handler: function (title, idx) {
            switch (idx) {
                case 0:
                    urlParameter = "q=" + searchContent
                    break;
                case 1:
                    urlParameter = "t=i&q=" + searchContent
                    break;
                case 2:
                    urlParameter = "t=v&q=" + searchContent
                    break;
                case 3:
                    urlParameter = "t=m&q=" + searchContent
                    break;
                case 4:
                    urlParameter = "t=n&q=" + searchContent
                    break;
                case 5:
                    urlParameter = "t=s&q=" + searchContent
                    break;
                case 6:
                    urlParameter = "t=b&q=" + searchContent
                    break;
                case 7:
                    urlParameter = "t=f&q=" + searchContent
                    break;
                case 8:
                    urlParameter = "t=sc&q=" + searchContent
                    break;
            }
            urlParameter = searchDomainName + urlParameter + "&p=1"
            generateShortLinks(urlParameter)
        }
    });
}

function generateShortLinks(searchPath) {
    searchPath = searchPath + detailedParameter
    $console.info(searchPath);
    $("textResult").text = searchPath
    // $http.shorten({
    //     url: encodeURI(searchPath),
    //     handler: function (url) {

    //     }
    // })
}

if ($app.env == $env.keyboard) {
    $("button-x").hidden = false
    $("button-send").hidden = false
    $("button-screen").hidden = false
}

function font(size) {
    return $objc("UIFont").invoke("systemFontOfSize", size).jsValue()
}