scriptVersion = 1.1
api = "http://moresound.tk/music/api.php?search="
api2 = "http://moresound.tk/music/api.php?get_song="
var cookie = ""
var source_cus = "qq"
var fileName = ""
var sourceView
var downloadGroup = [
    "FLAC",
    "320MP3",
    "192MP3",
    "128MP3",
    "MV",
    "专辑封面"
]

$ui.render({
    props: {
        id: "super-view",
        title: "魔声音乐下载"
    },
    views: [{
        type: "button",
        props: {
            id: "button-source",
            title: "QQ"
        },
        layout: function (make) {
            make.top.inset(10)
            make.left.inset(10)
            make.width.equalTo(50)
            make.height.equalTo(44)
        },
        events: {
            tapped: function (sender) {
                openCloseSource()
            }
        }
    }, {
        type: "input",
        props: {
            id: "input",
            placeholder: "请输入搜索内容"
        },
        layout: function (make) {
            make.left.equalTo($("button-source").right).offset(5)
            make.height.equalTo(44)
            make.top.inset(10)
        },
        events: {
            returned: function(sender) {
                searchMusic()
            }
        }
    }, {
        type: "button",
        props: {
            id: "button-search",
            title: "搜索"
        },
        layout: function (make) {
            make.top.inset(10)
            make.left.equalTo($("input").right).offset(5)
            make.right.inset(10)
            make.width.equalTo(50)
            make.height.equalTo(44)
        },
        events: {
            tapped: function (sender) {
                searchMusic()
            }
        }
    }, {
        type: "list",
        props: {
            id: "list",
            rowHeight: 80,
            template: [
                //     {
                //     type: "label",
                //     props: {
                //         id: "song_name", // 歌名
                //         align: $align.center,
                //         font: $font(20)
                //     },
                //     layout: function (make, view) {
                //         make.left.inset(10)
                //         make.bottom.equalTo(view.super.centerY).offset(-2.5)
                //     }
                // }, 
                {
                    type: "web",
                    props: {
                        id: "song_name", // 歌名
                        scrollEnabled: false,
                        userInteractionEnabled: false
                    },
                    layout: function (make, view) {
                        make.left.inset(10)
                        make.top.inset(0)
                        make.right.inset(10)
                        make.bottom.equalTo(view.super.centerY).offset(-2.5)
                    },
                    events: {
                        didFinish: function (sender, navigation) {
                            // $console.info(sender);
                            // sender.runtimeValue().invoke("stringByEvaluatingJavaScriptFromString", "document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '40%'")
                        }
                    }
                }, {
                    type: "label",
                    props: {
                        id: "singer_name", // 歌手名
                        align: $align.center,
                        textColor: $color("lightGray"),
                        font: $font(15)
                    },
                    layout: function (make, view) {
                        make.top.equalTo(view.super.centerY).offset(2.5)
                        make.left.inset(20)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "time_long", // 时长
                        textColor: $color("lightGray"),
                        align: $align.center,
                    },
                    layout: function (make, view) {
                        make.left.equalTo($("singer_name").right).offset(10)
                        make.top.equalTo(view.super.centerY).offset(2.5)
                    }
                }, {
                    type: "label",
                    props: {
                        id: "mid", // 详情 id
                        textColor: $color("clear"),
                        align: $align.center,
                    },
                    layout: function (make, view) {
                        make.left.equalTo($("song_name").right).offset(10)
                        make.bottom.equalTo(view.super.centerY).offset(-2.5)
                    }
                }]
        },
        layout: function (make, view) {
            make.left.right.bottom.equalTo(view.super)
            make.top.equalTo($("input").bottom).offset(10)
        },
        events: {
            didSelect: function (sender, indexPath, data) {
                $console.info(data.mid.text)
                fileName = data.song_name.text
                getMusicDetailData(data.mid.text)
            }
        }
    }, {
        type: "spinner",
        props: {
            loading: false,
            style: 2
        },
        layout: function (make, view) {
            make.center.equalTo(view.super)
        }
    }, {
        type: "view",
        props: {
            id: "source-view",
            bgcolor: $color("clear"),
            clipsToBounds: true
        },
        views: [{
            type: "button",
            props: {
                id: "button-qq",
                title: "QQ"
            },
            layout: function (make) {
                make.top.left.inset(0)
                make.height.equalTo(44)
                make.width.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    $("button-source").title = "QQ"
                    source_cus = "qq"
                    openCloseSource()
                }
            }
        }, {
            type: "button",
            props: {
                id: "button-kw",
                title: "酷我"
            },
            layout: function (make) {
                make.top.equalTo($("button-qq").bottom).offset(5)
                make.left.inset(0)
                make.height.equalTo(44)
                make.width.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    $("button-source").title = "酷我"
                    source_cus = "kw"
                    openCloseSource()
                }
            }
        }, {
            type: "button",
            props: {
                id: "button-kg",
                title: "酷狗"
            },
            layout: function (make) {
                make.top.equalTo($("button-kw").bottom).offset(5)
                make.left.inset(0)
                make.height.equalTo(44)
                make.width.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    $("button-source").title = "酷狗"
                    source_cus = "kg"
                    openCloseSource()
                }
            }
        }, {
            type: "button",
            props: {
                id: "button-wy",
                title: "网易"
            },
            layout: function (make) {
                make.top.equalTo($("button-kg").bottom).offset(5)
                make.left.inset(0)
                make.height.equalTo(44)
                make.width.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    $("button-source").title = "网易"
                    source_cus = "wy"
                    openCloseSource()
                }
            }
        }, {
            type: "button",
            props: {
                id: "button-bd",
                title: "百度"
            },
            layout: function (make) {
                make.top.equalTo($("button-wy").bottom).offset(5)
                make.left.inset(0)
                make.height.equalTo(44)
                make.width.equalTo(50)
            },
            events: {
                tapped: function (sender) {
                    $("button-source").title = "百度"
                    source_cus = "bd"
                    openCloseSource()
                }
            }
        }],
        layout: function (make) {
            make.left.inset(10)
            make.top.equalTo($("button-source").bottom).offset(5)
            make.width.equalTo(50)
            make.height.equalTo(0)
        }
    }
    ]
})

function getToken() { // code = 1 获取 token 后自动搜索
    $("spinner").start()
    $http.get({
        url: "http://moresound.tk/music/",
        handler: function (resp) {
            var data = resp.response
            cookie = data.headers["Set-Cookie"]
            searchMusic(source_cus)
        }
    });
}

function searchMusic() {
    var content = $("input").text
    if (content == "") {
        $ui.toast("请输入搜索内容");
        return
    }
    $("input").blur()
    if (cookie == "") {
        getToken()
        return
    } else {
        $("spinner").start()
    }
    url = api + source_cus
    $console.info(url);
    $http.request({
        method: "POST",
        url: encodeURI(url),
        header: {
            Cookie: cookie
        },
        body: {
        },
        form: {
            w: content,
            p: "1",
            n: "50"
        },
        handler: function (resp) {
            $("spinner").stop()
            var data = resp.data
            if (data.code == 1) {
                getToken()
            } else {
                $console.info(data)
                settingData(data)
            }
        }
    })
}

function settingData(data) {
    var resultGroup = data["song_list"].map(function (item) {
        var songname_cus = "<header><meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'></header>" + item.songname
        var group = { time_long: { text: item.interval }, mid: { text: item.songmid.toString() }, singer_name: { text: item.singer[0]["name"] }, song_name: { html: songname_cus } }
        return group
    })
    $("list").data = resultGroup
}

function getMusicDetailData(mid) {
    $("spinner").start()
    url = api2 + source_cus
    $http.request({
        method: "POST",
        url: encodeURI(url),
        header: {
            Cookie: cookie
        },
        body: {
        },
        form: {
            mid: mid,
        },
        handler: function (resp) {
            $("spinner").stop()
            var data = resp.data
            $console.info(data.url)
            $ui.menu({
                items: settingDownload(data.url),
                handler: function (title, idx) {
                    var url = data.url[title]
                    var newStr = url.indexOf("http");
                    if (newStr == -1) {
                        url = "http://moresound.tk/music/" + url
                        $("spinner").start()
                        $http.get({
                            url: url,
                            handler: function (resp) {
                                $("spinner").stop()
                                var url = resp.data.url;
                                var suffix = resp.data.suffix;
                                downloadUrl(url, suffix)
                            }
                        })
                    } else {
                        downloadUrl(url, "")
                    }


                },
                finished: function (cancelled) {

                }
            })
        }
    })
}

function settingDownload(urlGroup) {
    var newDownloadGroup = []
    downloadGroup.forEach(function (item) {
        if (urlGroup.hasOwnProperty(item) == true) {
            newDownloadGroup.push(item)
        }
    })
    return newDownloadGroup
}

function downloadUrl(url, suffix) {
    $ui.menu({
        items: ["下载", "复制下载链接"],
        handler: function (title, idx) {
            if (idx == 1) { // 复制下载链接
                $clipboard.text = url
            } else if (idx == 0) {
                $http.download({
                    url: url,
                    showsProgress: true, // Optional, default is true
                    progress: function (bytesWritten, totalBytes) {
                        var percentage = bytesWritten * 1.0 / totalBytes
                        $ui.progress(percentage)
                    },
                    handler: function (resp) {
                        $ui.progress(1.1)
                        $ui.toast("下载完成");
                        if (suffix == "") {
                            $share.sheet(resp.data)
                        } else {
                            $share.sheet([fileName + "." + suffix, resp.data])
                        }
                    }
                })
            }
        },
        finished: function (cancelled) {

        }
    })
}

$("input").focus()

function openCloseSource() {
    if ($("source-view").frame.height == 240) {
        $("source-view").updateLayout(function (make) {
            make.height.equalTo(0)
        })
        $ui.animate({
            duration: 0.4,
            animation: function () {
                $("source-view").relayout()
            }
        })
    } else {
        $("source-view").updateLayout(function (make) {
            make.height.equalTo(240)
        })
        $ui.animate({
            duration: 0.4,
            animation: function () {
                $("source-view").relayout()
            }
        })
    }
}

//检查版本
function checkupVersion() {
    $http.get({
        url: "https://raw.githubusercontent.com/nlnlnull/xTeko/master/MSDownload/UpdateInfo",
        handler: function (resp) {
            $console.info(resp.data)
            var version = resp.data.version;
            var updateUrl = resp.data.updateUrl;
            if (version > scriptVersion) {
                $ui.alert({
                    title: "发现新版本",
                    message: "发现新版本，是否更新",
                    actions: [{
                        title: "忽略",
                        handler: function () { }
                    },
                    {
                        title: "更新",
                        handler: function () {
                            $app.openURL(encodeURI(updateUrl))
                            $app.close()
                        }
                    }
                    ]
                })
            }
        }
    })
}

checkupVersion()